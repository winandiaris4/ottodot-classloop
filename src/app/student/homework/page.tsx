import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Calendar, CheckCircle2, Clock, ArrowRight, AlertCircle, Award } from 'lucide-react'

export default async function StudentHomeworkPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Fetch Enrolled Class IDs
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('class_id')
    .eq('student_id', user?.id || '')
    .eq('status', 'active')

  const enrolledClassIds = enrollments?.map((e) => e.class_id) || []

  // 2. Fetch Homework & Submissions
  let homeworkList: Array<{
    id: string
    title: string
    description: string | null
    due_at: string
    max_score: number
    className: string
    submission?: {
      id: string
      content: string | null
      score: number | null
      feedback: string | null
      submitted_at: string
    } | null
  }> = []

  if (enrolledClassIds.length > 0) {
    const { data: hwData } = await supabase
      .from('homework')
      .select(`
        id, title, description, due_at, max_score, class_id,
        classes:class_id (name)
      `)
      .in('class_id', enrolledClassIds)
      .eq('status', 'published')
      .order('due_at', { ascending: true })

    const { data: submissions } = await supabase
      .from('homework_submissions')
      .select('id, homework_id, content, score, feedback, submitted_at')
      .eq('student_id', user?.id || '')

    const submissionMap = new Map(submissions?.map((s) => [s.homework_id, s]))

    if (hwData) {
      homeworkList = hwData.map((hw) => ({
        id: hw.id,
        title: hw.title,
        description: hw.description,
        due_at: hw.due_at,
        max_score: hw.max_score,
        className: (hw.classes as { name?: string } | null)?.name || 'Class',
        submission: submissionMap.get(hw.id) || null,
      }))
    }
  }

  const todoList = homeworkList.filter((h) => !h.submission)
  const underReviewList = homeworkList.filter((h) => h.submission && h.submission.score === null)
  const gradedList = homeworkList.filter((h) => h.submission && h.submission.score !== null)

  const renderHomeworkCards = (items: typeof homeworkList, emptyMessage: string) => {
    if (items.length === 0) {
      return (
        <div className="py-16 text-center text-slate-400 space-y-2">
          <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-sm font-medium text-slate-600">{emptyMessage}</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((hw) => {
          const isGraded = hw.submission && hw.submission.score !== null
          const isUnderReview = hw.submission && hw.submission.score === null
          const isOverdue = new Date(hw.due_at) < new Date() && !hw.submission

          return (
            <Card
              key={hw.id}
              className={`flex flex-col justify-between transition-all border ${
                isGraded
                  ? 'border-emerald-200/90 bg-emerald-50/20'
                  : isUnderReview
                  ? 'border-blue-200/90 bg-blue-50/20'
                  : isOverdue
                  ? 'border-red-200 bg-red-50/20'
                  : 'border-slate-200/80 bg-white hover:border-slate-300'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px] bg-slate-50 font-medium">
                    {hw.className}
                  </Badge>
                  {isGraded ? (
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]">
                      <Award className="w-3 h-3 mr-1" /> Score: {hw.submission?.score}/{hw.max_score}
                    </Badge>
                  ) : isUnderReview ? (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-[10px]">
                      <Clock className="w-3 h-3 mr-1" /> Under Review
                    </Badge>
                  ) : isOverdue ? (
                    <Badge variant="destructive" className="text-[10px]">
                      Past Due
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px]">
                      To Do
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-base font-bold text-slate-900 mt-1">{hw.title}</CardTitle>
                <CardDescription className="text-xs text-slate-500 line-clamp-2">
                  {hw.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 border-t border-slate-100 mt-2">
                {isGraded && hw.submission?.feedback && (
                  <div className="my-2.5 p-2.5 rounded-lg bg-emerald-100/60 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <span className="font-semibold text-[11px] block">Teacher Feedback:</span>
                    <p className="line-clamp-2 italic">{hw.submission.feedback}</p>
                  </div>
                )}

                <div className="flex items-center justify-between py-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Due: {new Date(hw.due_at).toLocaleDateString()}
                  </span>
                  <span>Max: {hw.max_score} pts</span>
                </div>

                <Link
                  href={`/student/homework/${hw.id}`}
                  className={buttonVariants({
                    size: 'sm',
                    variant: isGraded ? 'outline' : 'default',
                    className: isGraded
                      ? 'w-full text-xs font-medium justify-between mt-1'
                      : 'w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium justify-between mt-1',
                  })}
                >
                  <span>{isGraded ? 'View Complete Feedback' : isUnderReview ? 'Inspect Submission' : 'Submit Homework'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">My Homework</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Complete science tasks, review teacher evaluations, and track your learning achievements.
        </p>
      </div>

      {/* Tabs Filter */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-slate-100 p-1 border border-slate-200">
          <TabsTrigger value="all" className="text-xs font-medium">
            All ({homeworkList.length})
          </TabsTrigger>
          <TabsTrigger value="todo" className="text-xs font-medium">
            To Do ({todoList.length})
          </TabsTrigger>
          <TabsTrigger value="under_review" className="text-xs font-medium">
            Under Review ({underReviewList.length})
          </TabsTrigger>
          <TabsTrigger value="graded" className="text-xs font-medium">
            Graded ({gradedList.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="pt-2">
          {renderHomeworkCards(homeworkList, 'No homework assignments found.')}
        </TabsContent>

        <TabsContent value="todo" className="pt-2">
          {renderHomeworkCards(todoList, 'Great job! You have no pending homework to complete.')}
        </TabsContent>

        <TabsContent value="under_review" className="pt-2">
          {renderHomeworkCards(underReviewList, 'No submissions currently under teacher review.')}
        </TabsContent>

        <TabsContent value="graded" className="pt-2">
          {renderHomeworkCards(gradedList, 'No graded assignments yet.')}
        </TabsContent>
      </Tabs>
    </div>
  )
}
