import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BookOpen, ArrowLeft, Calendar, CheckCircle2, Clock, FileText } from 'lucide-react'
import { GradeSubmissionDialog } from './GradeSubmissionDialog'

export default async function TeacherSubmissionsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch Homework Details
  const { data: homework } = await supabase
    .from('homework')
    .select(`
      id, title, description, due_at, max_score, status, class_id,
      classes:class_id (name)
    `)
    .eq('id', id)
    .single()

  if (!homework) {
    notFound()
  }

  // 2. Fetch Submissions for this homework
  const { data: submissions } = await supabase
    .from('homework_submissions')
    .select(`
      id, content, attachment_url, score, feedback, graded_at, submitted_at, student_id,
      student:user_profiles!homework_submissions_student_id_fkey (
        id, full_name, avatar_url
      )
    `)
    .eq('homework_id', id)
    .order('submitted_at', { ascending: false })

  const className = (homework.classes as { name?: string } | null)?.name || 'Class'
  const totalSubmissions = submissions?.length || 0
  const gradedCount = submissions?.filter((s) => s.score !== null).length || 0
  const pendingCount = totalSubmissions - gradedCount

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="space-y-2">
        <Link
          href="/teacher/homework"
          className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Homework List
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px] bg-slate-50 font-medium">
                {className}
              </Badge>
              <Badge variant={homework.status === 'published' ? 'default' : 'secondary'} className="text-[10px]">
                {homework.status}
              </Badge>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{homework.title}</h2>
          </div>
        </div>
      </div>

      {/* Task Prompt Overview */}
      <Card className="border-slate-200/80 bg-slate-50/50">
        <CardContent className="p-4 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Assignment Instructions & Prompt:</span>
          </div>
          <p className="text-slate-600 leading-relaxed pl-5 whitespace-pre-wrap">{homework.description}</p>
          <div className="flex items-center gap-4 pl-5 pt-1 text-[11px] text-slate-500">
            <span>Due Date: {new Date(homework.due_at).toLocaleString()}</span>
            <span>•</span>
            <span>Max Score: {homework.max_score} pts</span>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Submissions
            </CardTitle>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalSubmissions}</div>
            <p className="text-[11px] text-slate-500 mt-1">Submitted responses</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Graded & Released
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{gradedCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">Feedback provided</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Review
            </CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{pendingCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">Ready to grade</p>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card className="border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">Student Submissions</CardTitle>
          <CardDescription className="text-xs">
            Review individual student work and assign grades with feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissions && submissions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Student</TableHead>
                  <TableHead className="text-xs">Submitted At</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Score</TableHead>
                  <TableHead className="text-xs text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub) => {
                  const student = sub.student as { full_name?: string } | null
                  const studentName = student?.full_name || 'Student'
                  const isGraded = sub.score !== null

                  return (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium text-xs text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                            {studentName.charAt(0)}
                          </div>
                          <span>{studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(sub.submitted_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs">
                        {isGraded ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Graded
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                            <Clock className="w-3 h-3 mr-1" /> Needs Review
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-900">
                        {isGraded ? `${sub.score} / ${homework.max_score}` : '-'}
                      </TableCell>
                      <TableCell className="text-xs text-right">
                        <GradeSubmissionDialog
                          submission={{
                            id: sub.id,
                            content: sub.content,
                            score: sub.score,
                            feedback: sub.feedback,
                            submitted_at: sub.submitted_at,
                            studentName,
                          }}
                          homeworkTitle={homework.title}
                          maxScore={homework.max_score}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No submissions received yet</p>
              <p className="text-xs text-slate-400">Students enrolled in this class have not submitted work for this homework.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
