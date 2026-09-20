import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  School,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  CreditCard,
  BarChart3,
  ArrowRight,
  UserPlus,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
} from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Execute all dashboard queries in parallel (1 network roundtrip)
  const [
    { data: users = [] },
    { data: classes = [] },
    { data: enrollments = [] },
    { data: homework = [] },
    { data: submissions = [] },
  ] = await Promise.all([
    supabase.from('user_profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('classes').select('id, name, status, created_at, teacher:teacher_id(full_name)').order('created_at', { ascending: false }),
    supabase.from('enrollments').select('id, status, enrolled_at, student:student_id(full_name, id), class:class_id(name, id)').order('enrolled_at', { ascending: false }),
    supabase.from('homework').select('id, max_score'),
    supabase.from('homework_submissions').select('id, score, graded_at'),
  ])

  const totalUsers = users?.length || 0
  const teachersCount = users?.filter((u) => u.role === 'teacher').length || 0
  const studentsCount = users?.filter((u) => u.role === 'student').length || 0
  const parentsCount = users?.filter((u) => u.role === 'parent').length || 0
  const adminsCount = users?.filter((u) => u.role === 'admin').length || 0

  const activeClasses = classes?.filter((c) => c.status === 'active').length || 0
  const activeEnrollments = enrollments?.filter((e) => e.status === 'active').length || 0

  const totalHomework = homework?.length || 0
  const totalSubmissions = submissions?.length || 0
  const gradedSubmissions = submissions?.filter((s) => s.graded_at !== null) || []

  // Average score
  let avgPlatformScore = 0
  if (gradedSubmissions.length > 0) {
    const totalScore = gradedSubmissions.reduce((acc, curr) => acc + (curr.score || 0), 0)
    avgPlatformScore = Math.round(totalScore / gradedSubmissions.length)
  }

  // Recent 5 users
  const recentUsers = users?.slice(0, 5) || []
  // Recent 5 enrollments
  const recentEnrollments = enrollments?.slice(0, 5) || []

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-900 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-2">
          <Badge className="bg-rose-500/20 text-rose-300 border-rose-400/30 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Platform Administration
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            ClassLoop System Overview 🛡️
          </h2>
          <p className="text-slate-300 text-sm">
            Monitor academic operations, manage user roles & parent-child relationships, audit class enrollments, and analyze platform performance.
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/80 hover:border-slate-300 transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Accounts
            </CardTitle>
            <Users className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalUsers}</div>
            <p className="text-[11px] text-slate-500 mt-1">
              {teachersCount} teachers, {studentsCount} students, {parentsCount} parents
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 hover:border-slate-300 transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Courses
            </CardTitle>
            <School className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{activeClasses}</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Across all STEM subjects
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 hover:border-slate-300 transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Enrollments
            </CardTitle>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{activeEnrollments}</div>
            <p className="text-[11px] text-slate-500 mt-1">
              {(enrollments || []).length} lifetime enrollments
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 hover:border-slate-300 transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg. Assignment Score
            </CardTitle>
            <BarChart3 className="w-4 h-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {gradedSubmissions.length > 0 ? `${avgPlatformScore}%` : 'N/A'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {gradedSubmissions.length} graded / {totalSubmissions} submitted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Role Distribution Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
            <School className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-blue-950">{teachersCount}</div>
            <div className="text-xs text-blue-600 font-medium">Teachers</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-indigo-950">{studentsCount}</div>
            <div className="text-xs text-indigo-600 font-medium">Students</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-950">{parentsCount}</div>
            <div className="text-xs text-emerald-600 font-medium">Parents</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-rose-950">{adminsCount}</div>
            <div className="text-xs text-rose-600 font-medium">Admins</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Activity & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Registered Users & Enrollments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Users Table Card */}
          <Card className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Recent User Registrations</CardTitle>
                <CardDescription className="text-xs">Latest registered platform members</CardDescription>
              </div>
              <Link
                href="/admin/users"
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                  className: 'text-xs text-indigo-600 hover:text-indigo-700',
                })}
              >
                View All Users <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              {recentUsers.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">No registered users yet.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {user.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{user.full_name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] uppercase font-semibold ${
                            user.role === 'teacher'
                              ? 'bg-blue-100 text-blue-700'
                              : user.role === 'student'
                              ? 'bg-indigo-100 text-indigo-700'
                              : user.role === 'parent'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {user.role}
                        </Badge>
                        <span className="text-[11px] text-slate-400 hidden sm:inline">
                          {new Date(user.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Enrollments Card */}
          <Card className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Latest Class Enrollments</CardTitle>
                <CardDescription className="text-xs">Recent student registrations across active classes</CardDescription>
              </div>
              <Link
                href="/admin/enrollments"
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                  className: 'text-xs text-indigo-600 hover:text-indigo-700',
                })}
              >
                Manage Enrollments <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              {recentEnrollments.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">No enrollments yet.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentEnrollments.map((enr) => {
                    const studentObj = Array.isArray(enr.student) ? enr.student[0] : enr.student
                    const classObj = Array.isArray(enr.class) ? enr.class[0] : enr.class
                    return (
                      <div key={enr.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {studentObj?.full_name || 'Enrolled Student'}
                          </p>
                          <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                            <BookOpen className="w-3 h-3 text-slate-400" />
                            {classObj?.name || 'Assigned Class'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] capitalize ${
                              enr.status === 'active'
                                ? 'bg-emerald-100 text-emerald-700'
                                : enr.status === 'completed'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {enr.status}
                          </Badge>
                          <span className="text-[11px] text-slate-400 hidden sm:inline">
                            {new Date(enr.enrolled_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Quick Administrative Shortcuts & Platform Health */}
        <div className="space-y-6">
          <Card className="border-slate-200/80">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Administrative Shortcuts</CardTitle>
              <CardDescription className="text-xs">Common administrative workflows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/admin/users"
                className={buttonVariants({
                  variant: 'outline',
                  className: 'w-full justify-between text-xs font-medium py-2.5 h-auto',
                })}
              >
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Link Parent to Student</div>
                    <div className="text-[11px] text-slate-500">Connect guardian & child accounts</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
              </Link>

              <Link
                href="/admin/enrollments"
                className={buttonVariants({
                  variant: 'outline',
                  className: 'w-full justify-between text-xs font-medium py-2.5 h-auto',
                })}
              >
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Manage Enrollments</div>
                    <div className="text-[11px] text-slate-500">Enroll students into classes</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
              </Link>

              <Link
                href="/admin/reports"
                className={buttonVariants({
                  variant: 'outline',
                  className: 'w-full justify-between text-xs font-medium py-2.5 h-auto',
                })}
              >
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Operational Analytics</div>
                    <div className="text-[11px] text-slate-500">Class completion & grade trends</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
              </Link>
            </CardContent>
          </Card>

          {/* Academic Snapshot Card */}
          <Card className="border-slate-200/80 bg-gradient-to-br from-slate-50 to-indigo-50/30">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Academic Snapshot</CardTitle>
              <CardDescription className="text-xs">Curriculum volume & turnaround</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Total Assignments
                </span>
                <span className="font-bold text-slate-900">{totalHomework}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> Total Submissions
                </span>
                <span className="font-bold text-slate-900">{totalSubmissions}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Graded Submissions
                </span>
                <span className="font-bold text-emerald-600">{gradedSubmissions.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
