import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Award, CheckCircle2, Clock, FileText, Sparkles, User } from 'lucide-react'
import { SubmitHomeworkForm } from './SubmitHomeworkForm'

export default async function StudentHomeworkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Fetch Homework Info
  const { data: homework } = await supabase
    .from('homework')
    .select(`
      id, title, description, due_at, max_score, status, class_id,
      classes:class_id (name),
      teacher:teacher_id (full_name)
    `)
    .eq('id', id)
    .single()

  if (!homework) {
    notFound()
  }

  // 2. Fetch Student Submission
  const { data: submission } = await supabase
    .from('homework_submissions')
    .select('*')
    .eq('homework_id', id)
    .eq('student_id', user?.id || '')
    .maybeSingle()

  const className = (homework.classes as { name?: string } | null)?.name || 'Class'
  const teacherName = (homework.teacher as { full_name?: string } | null)?.full_name || 'Instructor'
  const isGraded = !!(submission && submission.score !== null)
  const isUnderReview = !!(submission && submission.score === null)
  const isOverdue = new Date(homework.due_at) < new Date() && !submission

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="space-y-2">
        <Link
          href="/student/homework"
          className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to My Homework
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="outline" className="text-[10px] bg-slate-50 font-medium">
                {className}
              </Badge>
              {isGraded ? (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]">
                  <Award className="w-3 h-3 mr-1" /> Graded: {submission?.score}/{homework.max_score}
                </Badge>
              ) : isUnderReview ? (
                <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-[10px]">
                  <Clock className="w-3 h-3 mr-1" /> Submitted (Under Review)
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
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{homework.title}</h2>
          </div>
        </div>
      </div>

      {/* Assignment Overview Card */}
      <Card className="border-slate-200/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" /> Instructor: {teacherName}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Due Date: {new Date(homework.due_at).toLocaleString()}
            </span>
            <span>Max Score: {homework.max_score} pts</span>
          </div>
          <CardTitle className="text-sm font-bold text-slate-900 pt-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" /> Instructions & Task Prompt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
            {homework.description}
          </div>
        </CardContent>
      </Card>

      {/* Graded Feedback Banner (If Graded) */}
      {isGraded && (
        <Card className="border-emerald-200 bg-emerald-50/40 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Teacher Grade & Evaluation
              </span>
              <Badge className="bg-emerald-600 text-white font-bold text-xs">
                Score: {submission?.score} / {homework.max_score}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            <div className="p-3.5 rounded-lg bg-white border border-emerald-200 text-xs space-y-1.5">
              <span className="font-semibold text-slate-700 block">Feedback from {teacherName}:</span>
              <p className="text-slate-800 italic leading-relaxed">{submission?.feedback || 'No written feedback provided.'}</p>
              {submission?.graded_at && (
                <p className="text-[10px] text-slate-400 pt-1">
                  Evaluated on {new Date(submission.graded_at).toLocaleString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission Card & Form */}
      <Card className="border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">
            {isGraded ? 'Your Submitted Work' : isUnderReview ? 'Your Current Submission' : 'Submit Your Solution'}
          </CardTitle>
          <CardDescription className="text-xs">
            {isGraded
              ? 'Below is the work you submitted for this assignment.'
              : 'Write down your answers, calculations, or paste links to your project.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubmitHomeworkForm
            homeworkId={homework.id}
            existingContent={submission?.content}
            existingAttachmentUrl={submission?.attachment_url}
            isGraded={isGraded}
          />
        </CardContent>
      </Card>
    </div>
  )
}

