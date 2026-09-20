import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, School, BookOpen, CheckCircle2, Clock, Award, ArrowLeft, Calendar, FileText } from 'lucide-react'

export default async function ParentChildrenProgressPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Fetch Linked Children
  const { data: parentLinks } = await supabase
    .from('parent_student_links')
    .select(`
      id, student_id,
      student:user_profiles!parent_student_links_student_id_fkey (
        id, full_name, avatar_url
      )
    `)
    .eq('parent_id', user?.id || '')

  const children = parentLinks?.map((l) => l.student as { id: string; full_name: string; avatar_url: string | null } | null).filter(Boolean) || []

  // 2. For each child, fetch enrolled classes & homework submissions
  const childrenData = await Promise.all(
    children.map(async (child) => {
      // Enrolled Classes
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          id, class_id, status, enrolled_at,
          classes:class_id (
            id, name, description,
            teacher:teacher_id (full_name)
          )
        `)
        .eq('student_id', child!.id)
        .eq('status', 'active')

      const classIds = enrollments?.map((e) => e.class_id) || []

      // Homework & Submissions for this child
      let homeworkItems: Array<{
        id: string
        title: string
        description: string | null
        due_at: string
        max_score: number
        className: string
        teacherName: string
        submission?: {
          score: number | null
          feedback: string | null
          content: string | null
          submitted_at: string
          graded_at: string | null
        } | null
      }> = []

      if (classIds.length > 0) {
        const { data: hwData } = await supabase
          .from('homework')
          .select(`
            id, title, description, due_at, max_score, class_id,
            classes:class_id (
              name,
              teacher:teacher_id (full_name)
            )
          `)
          .in('class_id', classIds)
          .eq('status', 'published')
          .order('due_at', { ascending: false })

        const { data: subData } = await supabase
          .from('homework_submissions')
          .select('id, homework_id, score, feedback, content, submitted_at, graded_at')
          .eq('student_id', child!.id)

        const subMap = new Map(subData?.map((s) => [s.homework_id, s]))

        if (hwData) {
          homeworkItems = hwData.map((hw) => {
            const classObj = hw.classes as { name?: string; teacher?: { full_name?: string } } | null
            return {
              id: hw.id,
              title: hw.title,
              description: hw.description,
              due_at: hw.due_at,
              max_score: hw.max_score,
              className: classObj?.name || 'Class',
              teacherName: classObj?.teacher?.full_name || 'Instructor',
              submission: subMap.get(hw.id) || null,
            }
          })
        }
      }

      return {
        ...child!,
        enrollments: enrollments || [],
        homeworkItems,
      }
    })
  )

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="space-y-1">
        <Link
          href="/parent/dashboard"
          className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Children Academic Progress</h2>
        <p className="text-xs text-slate-500">
          Comprehensive grade history, teacher feedback notes, and active coursework breakdown.
        </p>
      </div>

      {/* Children List */}
      {childrenData.length > 0 ? (
        <div className="space-y-8">
          {childrenData.map((child) => (
            <div key={child.id} className="space-y-4">
              {/* Child Profile Bar */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center font-bold text-lg">
                    {child.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{child.full_name}</h3>
                    <p className="text-xs text-slate-500">Enrolled in {child.enrollments.length} Active Classrooms</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium">
                    Verified Linked Account
                  </Badge>
                </div>
              </div>

              {/* Enrolled Classes Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {child.enrollments.map((enr) => {
                  const classObj = enr.classes as { id?: string; name?: string; description?: string | null; teacher?: { full_name?: string } } | null
                  return (
                    <Card key={enr.id} className="border-slate-200/80">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="outline" className="text-[10px] bg-slate-50">
                            Instructor: {classObj?.teacher?.full_name || 'Teacher'}
                          </Badge>
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]">
                            {enr.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-bold text-slate-900 mt-1">{classObj?.name}</CardTitle>
                        <CardDescription className="text-xs text-slate-500 line-clamp-2">
                          {classObj?.description || 'Interactive live edtech coursework.'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 text-[11px] text-slate-400">
                        Enrolled on {new Date(enr.enrolled_at).toLocaleDateString()}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Homework & Grade History */}
              <Card className="border-slate-200/80">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" /> Homework & Evaluation History
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Submitted answers and detailed feedback provided by the teacher.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {child.homeworkItems.length > 0 ? (
                    <div className="space-y-4">
                      {child.homeworkItems.map((hw) => {
                        const isGraded = hw.submission && hw.submission.score !== null
                        const isUnderReview = hw.submission && hw.submission.score === null

                        return (
                          <div
                            key={hw.id}
                            className={`p-4 rounded-xl border space-y-3 ${
                              isGraded
                                ? 'border-emerald-200 bg-emerald-50/20'
                                : isUnderReview
                                ? 'border-blue-200 bg-blue-50/20'
                                : 'border-slate-200 bg-slate-50/50'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-[10px] bg-white font-medium">
                                    {hw.className}
                                  </Badge>
                                  {isGraded ? (
                                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-bold">
                                      <Award className="w-3 h-3 mr-1" /> Score: {hw.submission?.score} / {hw.max_score}
                                    </Badge>
                                  ) : isUnderReview ? (
                                    <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-[10px]">
                                      <Clock className="w-3 h-3 mr-1" /> Submitted (Awaiting Teacher)
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px]">
                                      Pending Submission
                                    </Badge>
                                  )}
                                </div>
                                <h4 className="font-bold text-sm text-slate-900">{hw.title}</h4>
                              </div>

                              <span className="text-xs text-slate-500">
                                Due: {new Date(hw.due_at).toLocaleDateString()}
                              </span>
                            </div>

                            {/* Prompt Summary */}
                            <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200/80 leading-relaxed">
                              {hw.description}
                            </p>

                            {/* If Graded: Teacher Feedback Quote */}
                            {isGraded && hw.submission?.feedback && (
                              <div className="p-3.5 rounded-lg bg-emerald-100/70 border border-emerald-200 text-xs space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-emerald-950">
                                    Teacher Feedback from {hw.teacherName}:
                                  </span>
                                  {hw.submission.graded_at && (
                                    <span className="text-[10px] text-emerald-800">
                                      {new Date(hw.submission.graded_at).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                <p className="text-emerald-900 italic leading-relaxed">"{hw.submission.feedback}"</p>
                              </div>
                            )}

                            {/* Child Submission Answer Snippet */}
                            {hw.submission?.content && (
                              <div className="text-[11px] text-slate-500 bg-slate-100/60 p-2 rounded border border-slate-200">
                                <span className="font-semibold block mb-0.5">Submitted Work:</span>
                                <p className="font-mono line-clamp-2 text-slate-700">{hw.submission.content}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400 space-y-2">
                      <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-xs text-slate-500">No homework records found for this student.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-slate-200/80">
          <CardContent className="py-16 text-center text-slate-400 space-y-3">
            <Users className="w-12 h-12 mx-auto text-slate-300" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-800">No linked children found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your parent account is not currently linked to any student profile. Please contact the administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
