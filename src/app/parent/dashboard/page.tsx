import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, TrendingUp, CheckCircle2, Calendar, ArrowRight, Sparkles, BookOpen, Clock, Award, MessageSquare } from 'lucide-react'

export default async function ParentDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Fetch Linked Children
  const { data: parentLinks } = await supabase
    .from('parent_student_links')
    .select(`
      id, student_id, created_at,
      student:user_profiles!parent_student_links_student_id_fkey (
        id, full_name, avatar_url, created_at
      )
    `)
    .eq('parent_id', user?.id || '')

  const childrenList = parentLinks?.map((l) => l.student as { id: string; full_name: string; avatar_url: string | null } | null).filter(Boolean) || []
  const childIds = childrenList.map((c) => c!.id)

  // 2. Fetch Enrollments for Linked Children
  let enrollmentsCount = 0
  let classIds: string[] = []
  if (childIds.length > 0) {
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('id, class_id, student_id, status')
      .in('student_id', childIds)
      .eq('status', 'active')

    enrollmentsCount = enrollments?.length || 0
    classIds = enrollments?.map((e) => e.class_id) || []
  }

  // 3. Fetch Homework & Submissions for Linked Children
  let totalAssignedHw = 0
  let totalSubmittedHw = 0
  let totalGradedHw = 0
  let averageScore = 0
  let recentFeedbackList: Array<{
    id: string
    homeworkTitle: string
    score: number | null
    maxScore: number
    feedback: string | null
    studentName: string
    gradedAt: string | null
  }> = []

  if (classIds.length > 0 && childIds.length > 0) {
    const { data: homeworkList } = await supabase
      .from('homework')
      .select('id, title, max_score, class_id')
      .in('class_id', classIds)
      .eq('status', 'published')

    totalAssignedHw = homeworkList?.length || 0

    const { data: submissions } = await supabase
      .from('homework_submissions')
      .select(`
        id, homework_id, student_id, score, feedback, graded_at,
        homework:homework_id (title, max_score),
        student:user_profiles!homework_submissions_student_id_fkey (full_name)
      `)
      .in('student_id', childIds)

    if (submissions) {
      totalSubmittedHw = submissions.length
      const graded = submissions.filter((s) => s.score !== null)
      totalGradedHw = graded.length

      if (totalGradedHw > 0) {
        const totalPointsScored = graded.reduce((acc, curr) => acc + (curr.score || 0), 0)
        const totalMaxPoints = graded.reduce((acc, curr) => acc + ((curr.homework as { max_score?: number } | null)?.max_score || 100), 0)
        averageScore = Math.round((totalPointsScored / totalMaxPoints) * 100)
      }

      recentFeedbackList = submissions
        .filter((s) => s.feedback)
        .map((s) => ({
          id: s.id,
          homeworkTitle: (s.homework as { title?: string } | null)?.title || 'Assignment',
          score: s.score,
          maxScore: (s.homework as { max_score?: number } | null)?.max_score || 100,
          feedback: s.feedback,
          studentName: (s.student as { full_name?: string } | null)?.full_name || 'Child',
          gradedAt: s.graded_at,
        }))
    }
  }

  const completionRate = totalAssignedHw > 0 ? Math.round((totalSubmittedHw / totalAssignedHw) * 100) : 0

  // 4. Fetch Upcoming Sessions
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
      {/* Welcome Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-xl space-y-2">
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-xs font-semibold">
            <Sparkles className="w-3 h-3 mr-1" /> Parent Visibility Hub
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Stay connected with your child's learning journey 🌟
          </h2>
          <p className="text-amber-100 text-sm">
            Monitor real-time assignment submissions, view teacher evaluations, and keep track of live class schedules.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Linked Children
            </CardTitle>
            <Users className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{childrenList.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">{enrollmentsCount} active enrolled classes</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completion Rate
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{completionRate}%</div>
            <p className="text-[11px] text-slate-500 mt-1">{totalSubmittedHw} of {totalAssignedHw} tasks submitted</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Average Grade
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{averageScore > 0 ? `${averageScore}%` : '-'}</div>
            <p className="text-[11px] text-slate-500 mt-1">{totalGradedHw} evaluated assignments</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Upcoming Live Classes
            </CardTitle>
            <Calendar className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{upcomingSessions.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Sessions on schedule</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Linked Children Cards & Recent Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Children List with Academic Summary */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Children Progress Overview</CardTitle>
                <CardDescription className="text-xs">Academic achievements and assigned coursework</CardDescription>
              </div>
              <Link
                href="/parent/children"
                className={buttonVariants({ variant: 'outline', size: 'sm', className: 'text-xs' })}
              >
                Detailed Report <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              {childrenList.length > 0 ? (
                <div className="space-y-3">
                  {childrenList.map((child) => (
                    <div key={child!.id} className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center font-bold text-sm">
                            {child!.full_name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">{child!.full_name}</h4>
                            <p className="text-xs text-slate-500">Student Account</p>
                          </div>
                        </div>

                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                          Active Learner
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                        <div className="p-2 rounded-lg bg-slate-50">
                          <span className="text-[10px] text-slate-500 block uppercase font-medium">Completion</span>
                          <span className="text-sm font-bold text-slate-900">{completionRate}%</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50">
                          <span className="text-[10px] text-slate-500 block uppercase font-medium">Avg Grade</span>
                          <span className="text-sm font-bold text-slate-900">{averageScore > 0 ? `${averageScore}%` : '-'}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50">
                          <span className="text-[10px] text-slate-500 block uppercase font-medium">Enrolled</span>
                          <span className="text-sm font-bold text-slate-900">{enrollmentsCount} Classes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Users className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-medium text-slate-600">No linked children found</p>
                  <p className="text-xs text-slate-400">An administrator will link your child's student account.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Recent Teacher Feedback */}
        <div className="space-y-4">
          <Card className="border-slate-200/80">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" /> Teacher Feedback
              </CardTitle>
              <CardDescription className="text-xs">Direct evaluations from instructors</CardDescription>
            </CardHeader>
            <CardContent>
              {recentFeedbackList.length > 0 ? (
                <div className="space-y-3">
                  {recentFeedbackList.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-lg border border-emerald-200/80 bg-emerald-50/40 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{item.homeworkTitle}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">For {item.studentName}</p>
                        </div>
                        <Badge className="bg-emerald-600 text-white font-bold text-[10px] shrink-0">
                          {item.score} / {item.maxScore}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded border border-emerald-200/60 leading-relaxed">
                        "{item.feedback}"
                      </p>

                      {item.gradedAt && (
                        <p className="text-[10px] text-slate-400 text-right">
                          {new Date(item.gradedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-slate-400 space-y-2">
                  <Award className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs text-slate-500">No teacher feedback recorded yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
