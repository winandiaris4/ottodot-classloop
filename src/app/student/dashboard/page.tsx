import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Calendar, CheckCircle2, Clock, ArrowRight, Sparkles, AlertCircle, Award } from 'lucide-react'

export default async function StudentDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Fetch Enrolled Classes
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      id, class_id, status, enrolled_at,
      classes:class_id (id, name, description)
    `)
    .eq('student_id', user?.id || '')
    .eq('status', 'active')

  const enrolledClassIds = enrollments?.map((e) => e.class_id) || []

  // 2. Fetch Homework for Enrolled Classes
  let homeworkList: Array<{
    id: string
    title: string
    description: string | null
    due_at: string
    max_score: number
    class_id: string
    className: string
    submission?: {
      id: string
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
      .select('id, homework_id, score, feedback, submitted_at')
      .eq('student_id', user?.id || '')

    const submissionMap = new Map(submissions?.map((s) => [s.homework_id, s]))

    if (hwData) {
      homeworkList = hwData.map((hw) => ({
        id: hw.id,
        title: hw.title,
        description: hw.description,
        due_at: hw.due_at,
        max_score: hw.max_score,
        class_id: hw.class_id,
        className: (hw.classes as { name?: string } | null)?.name || 'Class',
        submission: submissionMap.get(hw.id) || null,
      }))
    }
  }

  const pendingHomework = homeworkList.filter((h) => !h.submission)
  const underReviewHomework = homeworkList.filter((h) => h.submission && h.submission.score === null)
  const gradedHomework = homeworkList.filter((h) => h.submission && h.submission.score !== null)

  // 3. Fetch Upcoming Class Sessions
  let upcomingSessions: Array<{
    id: string
    starts_at: string
    notes: string | null
    className: string
  }> = []

  if (enrolledClassIds.length > 0) {
    const { data: sessions } = await supabase
      .from('class_sessions')
      .select(`
        id, starts_at, notes, class_id,
        classes:class_id (name)
      `)
      .in('class_id', enrolledClassIds)
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
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-xl space-y-2">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs font-semibold">
            <Sparkles className="w-3 h-3 mr-1" /> Student Space
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready for your next learning mission? 🚀
          </h2>
          <p className="text-indigo-200 text-sm">
            Check your pending assignments, review teacher feedback, and prepare for upcoming live classes.
          </p>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Tasks
            </CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{pendingHomework.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">To do assignments</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Under Review
            </CardTitle>
            <AlertCircle className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{underReviewHomework.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Submitted to teacher</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Graded Tasks
            </CardTitle>
            <Award className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{gradedHomework.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Feedback received</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Classes
            </CardTitle>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{enrollments?.length || 0}</div>
            <p className="text-[11px] text-slate-500 mt-1">Active learning tracks</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Pending Tasks & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Assignments */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Current Assignments</CardTitle>
                <CardDescription className="text-xs">Homework requiring your attention</CardDescription>
              </div>
              <Link
                href="/student/homework"
                className={buttonVariants({ variant: 'outline', size: 'sm', className: 'text-xs' })}
              >
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              {homeworkList.length > 0 ? (
                <div className="space-y-3">
                  {homeworkList.map((hw) => {
                    const isGraded = hw.submission && hw.submission.score !== null
                    const isUnderReview = hw.submission && hw.submission.score === null

                    return (
                      <div
                        key={hw.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isGraded
                            ? 'border-emerald-200 bg-emerald-50/30'
                            : isUnderReview
                            ? 'border-blue-200 bg-blue-50/30'
                            : 'border-slate-200 bg-white hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] bg-white font-medium">
                                {hw.className}
                              </Badge>
                              {isGraded && (
                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]">
                                  <CheckCircle2 className="w-3 h-3 mr-1" /> Graded: {hw.submission?.score}/{hw.max_score}
                                </Badge>
                              )}
                              {isUnderReview && (
                                <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-[10px]">
                                  <Clock className="w-3 h-3 mr-1" /> Under Review
                                </Badge>
                              )}
                              {!hw.submission && (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px]">
                                  To Do
                                </Badge>
                              )}
                            </div>

                            <h4 className="font-bold text-sm text-slate-900">{hw.title}</h4>
                            <p className="text-xs text-slate-500 line-clamp-1">{hw.description}</p>
                          </div>

                          <Link
                            href={`/student/homework/${hw.id}`}
                            className={buttonVariants({
                              size: 'sm',
                              variant: isGraded ? 'outline' : 'default',
                              className: isGraded
                                ? 'text-xs'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shrink-0',
                            })}
                          >
                            {isGraded ? 'View Feedback' : isUnderReview ? 'View Submission' : 'Start Mission'}
                            <ArrowRight className="w-3 h-3 ml-1.5" />
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-medium text-slate-600">No active homework</p>
                  <p className="text-xs text-slate-400">You are all caught up on your tasks!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Live Class Schedule */}
        <div className="space-y-4">
          <Card className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Live Schedule</CardTitle>
                <CardDescription className="text-xs">Upcoming live virtual sessions</CardDescription>
              </div>
              <Link
                href="/student/schedule"
                className={buttonVariants({ variant: 'outline', size: 'sm', className: 'text-xs' })}
              >
                Calendar
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-3">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="p-3 rounded-lg border border-indigo-100 bg-indigo-50/40 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{new Date(session.starts_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <span>•</span>
                        <span>{new Date(session.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-800">{session.className}</p>
                      {session.notes && (
                        <p className="text-[11px] text-slate-500 line-clamp-1">{session.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-slate-400 space-y-2">
                  <Calendar className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs text-slate-500">No scheduled sessions this week.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
