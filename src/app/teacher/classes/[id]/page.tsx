import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { School, Users, BookOpen, ArrowLeft, Plus, Calendar, Clock } from 'lucide-react'

export default async function TeacherClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch Class Details
  const { data: classData } = await supabase
    .from('classes')
    .select('*')
    .eq('id', id)
    .single()

  if (!classData) {
    notFound()
  }

  // 2. Fetch Enrolled Students
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      id, status, enrolled_at,
      student:user_profiles!enrollments_student_id_fkey (
        id, full_name, role, avatar_url
      )
    `)
    .eq('class_id', id)
    .order('enrolled_at', { ascending: false })

  // 3. Fetch Homework for this class
  const { data: homeworkList } = await supabase
    .from('homework')
    .select(`
      id, title, description, due_at, max_score, status, created_at,
      submissions:homework_submissions (id, score)
    `)
    .eq('class_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/teacher/classes"
            className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Classes
          </Link>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{classData.name}</h2>
            <Badge variant="outline" className="text-xs capitalize">
              {classData.status}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">{classData.description || 'No description provided.'}</p>
        </div>

        <Link
          href="/teacher/homework"
          className={buttonVariants({ size: 'sm', className: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs' })}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Homework
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </CardTitle>
            <Users className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{enrollments?.length || 0} / {classData.max_students}</div>
            <p className="text-[11px] text-slate-500 mt-1">Active class seats</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Homework Assigned
            </CardTitle>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{homeworkList?.length || 0}</div>
            <p className="text-[11px] text-slate-500 mt-1">Total assignments</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Class Status
            </CardTitle>
            <School className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize text-slate-900">{classData.status}</div>
            <p className="text-[11px] text-slate-500 mt-1">Created {new Date(classData.created_at).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Student Roster & Homework */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Roster Table */}
        <Card className="border-slate-200/80">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Student Roster</CardTitle>
            <CardDescription className="text-xs">Students actively enrolled in this classroom</CardDescription>
          </CardHeader>
          <CardContent>
            {enrollments && enrollments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Student</TableHead>
                    <TableHead className="text-xs">Enrolled Date</TableHead>
                    <TableHead className="text-xs text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((e) => {
                    const student = e.student as { full_name?: string; avatar_url?: string } | null
                    return (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium text-xs text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                              {student?.full_name?.charAt(0) || 'S'}
                            </div>
                            <span>{student?.full_name || 'Student'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {new Date(e.enrolled_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-xs text-right">
                          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                            {e.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="py-10 text-center text-slate-400 space-y-2">
                <Users className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs text-slate-500">No students enrolled in this class yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assigned Homework Table */}
        <Card className="border-slate-200/80">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Assigned Homework</CardTitle>
            <CardDescription className="text-xs">Assignments published for this class</CardDescription>
          </CardHeader>
          <CardContent>
            {homeworkList && homeworkList.length > 0 ? (
              <div className="space-y-3">
                {homeworkList.map((hw) => {
                  const submissionsCount = hw.submissions?.length || 0
                  const gradedCount = hw.submissions?.filter((s) => s.score !== null).length || 0

                  return (
                    <div key={hw.id} className="p-3 rounded-lg border border-slate-200/80 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-xs text-slate-900">{hw.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              Due: {new Date(hw.due_at).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>Max: {hw.max_score} pts</span>
                          </div>
                        </div>
                        <Badge variant={hw.status === 'published' ? 'default' : 'secondary'} className="text-[10px]">
                          {hw.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                        <span className="text-[11px] text-slate-500">
                          {submissionsCount} submissions ({gradedCount} graded)
                        </span>
                        <Link
                          href={`/teacher/homework/${hw.id}/submissions`}
                          className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'text-xs h-7 px-2' })}
                        >
                          View Submissions
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-slate-400 space-y-2">
                <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs text-slate-500">No homework created for this class yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
