import React from 'react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/actions/auth'
import { getCachedParentDashboardData } from '@/lib/cache/dashboard-cache'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, TrendingUp, CheckCircle2, Calendar, ArrowRight, BookOpen, MessageSquare } from 'lucide-react'

export async function ParentDashboardData() {
  const user = await getCurrentUser()
  const {
    childrenCount,
    enrollmentsCount,
    totalGradedHw,
    averageScore,
    completionRate,
    totalSubmittedHw,
    totalAssignedHw,
    recentFeedbackList,
    upcomingSessions,
  } = await getCachedParentDashboardData(user?.id || '')

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monitored Children
            </CardTitle>
            <Users className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{childrenCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">Linked student accounts</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Courses
            </CardTitle>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{enrollmentsCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">Active class subjects</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg. Performance
            </CardTitle>
            <div className="w-4 h-4 text-emerald-600 font-bold">%</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalGradedHw > 0 ? `${averageScore}%` : 'N/A'}</div>
            <p className="text-[11px] text-slate-500 mt-1">Across all graded work</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completion Rate
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{completionRate}%</div>
            <p className="text-[11px] text-slate-500 mt-1">{totalSubmittedHw}/{totalAssignedHw} submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Teacher Feedback & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Teacher Evaluations & Feedback */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Recent Teacher Feedback</CardTitle>
                <CardDescription className="text-xs">Direct evaluations on your child&apos;s assignments</CardDescription>
              </div>
              <Link
                href="/parent/children"
                prefetch={true}
                className={buttonVariants({ variant: 'outline', size: 'sm', className: 'text-xs' })}
              >
                View Children <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              {recentFeedbackList.length > 0 ? (
                <div className="space-y-3">
                  {recentFeedbackList.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{item.studentName}</span>
                          <Badge variant="outline" className="text-[10px] bg-white">
                            {item.homeworkTitle}
                          </Badge>
                        </div>
                        {item.score !== null && (
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 text-xs font-bold">
                            Score: {item.score}/{item.maxScore}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200/60">
                        <MessageSquare className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                        <p className="italic leading-relaxed">&ldquo;{item.feedback}&rdquo;</p>
                      </div>
                      {item.gradedAt && (
                        <p className="text-[10px] text-slate-400">
                          Evaluated on {new Date(item.gradedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No teacher feedback records found yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Upcoming Schedule */}
        <div className="space-y-6">
          <Card className="border-slate-200/80">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Upcoming Live Classes</CardTitle>
              <CardDescription className="text-xs">Schedule for this week</CardDescription>
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
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <Calendar className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                  <p className="text-xs">No upcoming sessions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
