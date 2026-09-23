import React from 'react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/actions/auth'
import { getCachedTeacherDashboardData } from '@/lib/cache/dashboard-cache'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { School, ClipboardCheck, Users, Plus, ArrowRight, CheckCircle2 } from 'lucide-react'

export async function TeacherDashboardData() {
  const user = await getCurrentUser()
  const { classesCount, totalStudents, pendingSubmissionsList } = await getCachedTeacherDashboardData(user?.id || '')

  return (
    <div className="space-y-6">
      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Assigned Classes
            </CardTitle>
            <School className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{classesCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">Active courses taught</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </CardTitle>
            <Users className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalStudents}</div>
            <p className="text-[11px] text-slate-500 mt-1">Across all your classes</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ungraded Submissions
            </CardTitle>
            <ClipboardCheck className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{pendingSubmissionsList.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Pending review & feedback</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Pending Grading & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Submissions Awaiting Grading */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Grading Queue</CardTitle>
                <CardDescription className="text-xs">Student work waiting for your evaluation</CardDescription>
              </div>
              <Link
                href="/teacher/homework"
                prefetch={true}
                className={buttonVariants({ variant: 'outline', size: 'sm', className: 'text-xs' })}
              >
                Manage Homework <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              {pendingSubmissionsList.length > 0 ? (
                <div className="space-y-3">
                  {pendingSubmissionsList.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] bg-slate-50 font-medium">
                            {sub.className}
                          </Badge>
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px]">
                            Needs Grade
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-sm text-slate-900">{sub.homeworkTitle}</h4>
                        <p className="text-xs text-slate-400">
                          Submitted on {new Date(sub.submittedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <Link
                          href={`/teacher/homework/${sub.homeworkId}/submissions`}
                          prefetch={true}
                          className={buttonVariants({
                            size: 'sm',
                            className: 'text-xs bg-indigo-600 hover:bg-indigo-700 text-white',
                          })}
                        >
                          Grade Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                  <p className="text-sm font-medium text-slate-700">All caught up!</p>
                  <p className="text-xs text-slate-400">No student submissions are waiting for grading right now.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Quick Links & Class Summary */}
        <div className="space-y-6">
          <Card className="border-slate-200/80">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Quick Shortcuts</CardTitle>
              <CardDescription className="text-xs">Class management actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/teacher/homework"
                prefetch={true}
                className={buttonVariants({
                  variant: 'outline',
                  className: 'w-full justify-start text-xs font-semibold py-2.5 h-auto',
                })}
              >
                <Plus className="w-4 h-4 mr-2 text-indigo-600" /> Create New Homework
              </Link>
              <Link
                href="/teacher/classes"
                prefetch={true}
                className={buttonVariants({
                  variant: 'outline',
                  className: 'w-full justify-start text-xs font-semibold py-2.5 h-auto',
                })}
              >
                <School className="w-4 h-4 mr-2 text-blue-600" /> View Class Rosters
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
