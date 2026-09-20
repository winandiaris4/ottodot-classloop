import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { School, ClipboardCheck, Users, Calendar, Plus, ArrowRight, Sparkles, Clock, CheckCircle2 } from 'lucide-react'

export default async function TeacherDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Fetch Teacher's active classes
  const { data: classes } = await supabase
    .from('classes')
    .select('id, name, description, max_students, status, created_at')
    .eq('teacher_id', user?.id || '')
    .order('created_at', { ascending: false })

  const classIds = classes?.map((c) => c.id) || []

  // 2. Fetch Total Enrolled Students
  let totalStudents = 0
  if (classIds.length > 0) {
    const { count } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .in('class_id', classIds)
      .eq('status', 'active')
    totalStudents = count || 0
  }

  // 3. Fetch Homework & Pending Submissions
  const { data: homeworkList } = await supabase
    .from('homework')
    .select(`
      id, title, due_at, max_score, status, class_id,
      classes:class_id (name),
      submissions:homework_submissions (id, student_id, score, submitted_at)
    `)
    .eq('teacher_id', user?.id || '')
    .order('created_at', { ascending: false })

  // Find submissions awaiting grading
  const pendingSubmissionsList: Array<{
    id: string
    homeworkId: string
    homeworkTitle: string
    className: string
    submittedAt: string
  }> = []

  homeworkList?.forEach((hw) => {
    const className = (hw.classes as { name?: string } | null)?.name || 'Class'
    hw.submissions?.forEach((sub) => {
      if (sub.score === null) {
        pendingSubmissionsList.push({
          id: sub.id,
          homeworkId: hw.id,
          homeworkTitle: hw.title,
          className,
          submittedAt: sub.submitted_at,
        })
      }
    })
  })

  // 4. Fetch Upcoming Class Sessions
  let upcomingSessions: Array<{
    id: string
    starts_at: string
    notes: string | null
    className: string
  }> = []

  if (classIds.length > 0) {
    const { data: sessions } = await supabase
      .from('class_sessions')
      .select(`
        id, starts_at, notes, class_id,
        classes:class_id (name)
      `)
      .in('class_id', classIds)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(3)

    if (sessions) {
      upcomingSessions = sessions.map((s) => ({
        id: s.id,
        starts_at: s.starts_at,
        notes: s.notes,
        className: (s.classes as { name?: string } | null)?.name || 'Class',
      }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-xl space-y-2">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
            <Sparkles className="w-3 h-3 mr-1" /> Teacher Workspace
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back to Ottodot ClassLoop! 📚
          </h2>
          <p className="text-blue-200 text-sm">
            Monitor student submissions, provide targeted feedback, and organize homework in real-time.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Classes
            </CardTitle>
            <School className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{classes?.length || 0}</div>
            <p className="text-[11px] text-slate-500 mt-1">Live classes taught</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Needs Grading
            </CardTitle>
            <ClipboardCheck className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{pendingSubmissionsList.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Submissions awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </CardTitle>
            <Users className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalStudents}</div>
            <p className="text-[11px] text-slate-500 mt-1">Students across classes</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Upcoming Sessions
            </CardTitle>
            <Calendar className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{upcomingSessions.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Scheduled live sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Classes List & Fast Homework Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">My Classes</CardTitle>
                <CardDescription className="text-xs">Classes currently managed by you</CardDescription>
              </div>
              <Link
                href="/teacher/classes"
                className={buttonVariants({ size: 'sm', className: 'text-xs bg-indigo-600 hover:bg-indigo-700 text-white' })}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Manage Classes
              </Link>
            </CardHeader>
            <CardContent>
              {classes && classes.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {classes.map((c) => (
                    <div key={c.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900">{c.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{c.description || 'No description provided'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs text-slate-600">
                          Max {c.max_students} students
                        </Badge>
                        <Link
                          href={`/teacher/classes/${c.id}`}
                          className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'text-xs' })}
                        >
                          View Roster <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 space-y-2">
                  <School className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-sm font-medium text-slate-600">No classes created yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Submissions Awaiting Grading */}
        <div className="space-y-4">
          <Card className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Pending Review</CardTitle>
                <CardDescription className="text-xs">Submissions ready for grading</CardDescription>
              </div>
              <Link
                href="/teacher/homework"
                className={buttonVariants({ variant: 'outline', size: 'sm', className: 'text-xs' })}
              >
                All <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              {pendingSubmissionsList.length > 0 ? (
                <div className="space-y-3">
                  {pendingSubmissionsList.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg border border-amber-200/70 bg-amber-50/50 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">{item.homeworkTitle}</p>
                          <p className="text-[11px] text-amber-800 font-medium mt-0.5">{item.className}</p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px] shrink-0">
                          <Clock className="w-3 h-3 mr-1" /> Pending
                        </Badge>
                      </div>
                      <div className="pt-1">
                        <Link
                          href={`/teacher/homework/${item.homeworkId}/submissions`}
                          className={buttonVariants({ size: 'sm', className: 'w-full text-xs bg-amber-600 hover:bg-amber-700 text-white' })}
                        >
                          Grade Submission <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                  <p className="text-sm font-medium text-slate-600">All submissions graded!</p>
                  <p className="text-xs text-slate-400">No pending student homework in queue.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
