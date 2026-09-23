import React from 'react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/actions/auth'
import { getCachedStudentDashboardData } from '@/lib/cache/dashboard-cache'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Calendar, CheckCircle2, Clock, ArrowRight, AlertCircle, Award } from 'lucide-react'

export async function StudentDashboardData() {
  const user = await getCurrentUser()
  const { enrollmentsCount, homeworkList, upcomingSessions } = await getCachedStudentDashboardData(user?.id || '')

  const pendingHomework = homeworkList.filter((h) => !h.submission)
  const underReviewHomework = homeworkList.filter((h) => h.submission && h.submission.score === null)
  const gradedHomework = homeworkList.filter((h) => h.submission && h.submission.score !== null)

  return (
    <div className="space-y-6">
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
            <div className="text-2xl font-bold text-slate-900">{enrollmentsCount}</div>
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
                prefetch={true}
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
                              {isGraded ? (
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px]">
                                  Graded: {hw.submission?.score}/{hw.max_score}
                                </Badge>
                              ) : isUnderReview ? (
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px]">
                                  Under Review
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-[10px]">
                                  Due: {new Date(hw.due_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-semibold text-sm text-slate-900">{hw.title}</h4>
                            {hw.description && (
                              <p className="text-xs text-slate-500 line-clamp-1">{hw.description}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isGraded ? (
                              <Link
                                href={`/student/homework/${hw.id}`}
                                prefetch={true}
                                className={buttonVariants({
                                  variant: 'ghost',
                                  size: 'sm',
                                  className: 'text-xs text-emerald-700 hover:bg-emerald-100/50',
                                })}
                              >
                                View Grade
                              </Link>
                            ) : isUnderReview ? (
                              <Link
                                href={`/student/homework/${hw.id}`}
                                prefetch={true}
                                className={buttonVariants({
                                  variant: 'ghost',
                                  size: 'sm',
                                  className: 'text-xs text-blue-700 hover:bg-blue-100/50',
                                })}
                              >
                                Details
                              </Link>
                            ) : (
                              <Link
                                href={`/student/homework/${hw.id}`}
                                prefetch={true}
                                className={buttonVariants({
                                  size: 'sm',
                                  className: 'text-xs bg-indigo-600 hover:bg-indigo-700 text-white',
                                })}
                              >
                                Submit Work
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No homework assignments yet!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Upcoming Sessions */}
        <div className="space-y-6">
          <Card className="border-slate-200/80">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Upcoming Live Sessions</CardTitle>
              <CardDescription className="text-xs">Your next scheduled virtual classes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session) => (
                  <div key={session.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{session.className}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(session.starts_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(session.starts_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    {session.notes && <p className="text-[11px] text-slate-500 mt-1">{session.notes}</p>}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <Calendar className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                  <p className="text-xs">No upcoming sessions this week</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
