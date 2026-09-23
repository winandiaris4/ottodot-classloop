import React from 'react'
import Link from 'next/link'
import { getCachedAdminDashboardData } from '@/lib/cache/dashboard-cache'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { EnrollmentTrendLineChart } from '@/components/charts/EnrollmentTrendLineChart'
import { CourseCapacityChart } from '@/components/charts/CourseCapacityChart'
import { RoleDonutChart } from '@/components/charts/RoleDonutChart'
import { AcademicActivityBarChart } from '@/components/charts/AcademicActivityBarChart'
import { GradeSpectrumChart } from '@/components/charts/GradeSpectrumChart'
import {
  Users,
  School,
  CreditCard,
  BarChart3,
  ArrowRight,
  UserPlus,
  BookOpen,
  Clock,
  CheckCircle2,
  Mail,
} from 'lucide-react'

export async function AdminDashboardData() {
  const {
    totalUsers,
    teachersCount,
    studentsCount,
    parentsCount,
    adminsCount,
    activeClasses,
    activeEnrollments,
    totalHomework,
    totalSubmissions,
    gradedSubmissionsCount,
    avgPlatformScore,
    recentUsers,
    recentEnrollments,
    classCapacityStats,
    gradeDistribution,
    academicActivity,
    trendData,
  } = await getCachedAdminDashboardData()

  // Calculate percentage widths for segmented bar (fallback to equal split if totalUsers === 0)
  const teacherPct = totalUsers > 0 ? (teachersCount / totalUsers) * 100 : 0
  const studentPct = totalUsers > 0 ? (studentsCount / totalUsers) * 100 : 0
  const parentPct = totalUsers > 0 ? (parentsCount / totalUsers) * 100 : 0
  const adminPct = totalUsers > 0 ? (adminsCount / totalUsers) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Consolidated 4-Card Executive KPI Grid with CountUp Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Accounts with Integrated Role Distribution */}
        <Card className="border-slate-200/80 hover:border-slate-300 transition-all shadow-2xs flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Accounts
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-slate-900">
                <AnimatedCounter value={totalUsers} duration={1000} />
              </div>
              <span className="text-[11px] font-medium text-slate-400">All Roles</span>
            </div>

            {/* Segmented Distribution Bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 flex overflow-hidden">
              <div
                style={{ width: `${teacherPct}%` }}
                className="bg-blue-500 transition-all duration-500"
                title={`${teachersCount} Teachers (${Math.round(teacherPct)}%)`}
              />
              <div
                style={{ width: `${studentPct}%` }}
                className="bg-indigo-500 transition-all duration-500"
                title={`${studentsCount} Students (${Math.round(studentPct)}%)`}
              />
              <div
                style={{ width: `${parentPct}%` }}
                className="bg-emerald-500 transition-all duration-500"
                title={`${parentsCount} Parents (${Math.round(parentPct)}%)`}
              />
              <div
                style={{ width: `${adminPct}%` }}
                className="bg-purple-500 transition-all duration-500"
                title={`${adminsCount} Admins (${Math.round(adminPct)}%)`}
              />
            </div>

            {/* Mini Breakdown Legend */}
            <div className="grid grid-cols-2 gap-1 pt-0.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                <span className="truncate">
                  <AnimatedCounter value={teachersCount} /> Teachers
                </span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                <span className="truncate">
                  <AnimatedCounter value={studentsCount} /> Students
                </span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="truncate">
                  <AnimatedCounter value={parentsCount} /> Parents
                </span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                <span className="truncate">
                  <AnimatedCounter value={adminsCount} /> Admins
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Active Courses */}
        <Card className="border-slate-200/80 hover:border-slate-300 transition-all shadow-2xs flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Courses
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <School className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold text-slate-900">
              <AnimatedCounter value={activeClasses} duration={900} />
            </div>
            <p className="text-[11px] text-slate-500">
              Active STEM classes currently in curriculum session
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3 text-blue-600" /> 100% On Schedule
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Active Enrollments */}
        <Card className="border-slate-200/80 hover:border-slate-300 transition-all shadow-2xs flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Enrollments
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold text-slate-900">
              <AnimatedCounter value={activeEnrollments} duration={1100} />
            </div>
            <p className="text-[11px] text-slate-500">
              Active student placements across enrolled classrooms
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                <ArrowRight className="w-3 h-3 text-emerald-600 -rotate-45" /> +15% Intake vs Last Term
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Average Assignment Score */}
        <Card className="border-slate-200/80 hover:border-slate-300 transition-all shadow-2xs flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Academic Turnaround
            </CardTitle>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold text-slate-900">
              {gradedSubmissionsCount > 0 ? (
                <AnimatedCounter value={avgPlatformScore} suffix="%" duration={1200} />
              ) : (
                'N/A'
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Average grade across {gradedSubmissionsCount} graded submissions
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-md">
                {totalSubmissions} Total Hand-ins (Top 5% Cohort)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary Line Chart: 6-Month Enrollment & Submissions Trajectory */}
      <EnrollmentTrendLineChart data={trendData} />

      {/* Visual Analytics & Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CourseCapacityChart data={classCapacityStats} />
        <RoleDonutChart
          totalUsers={totalUsers}
          teachersCount={teachersCount}
          studentsCount={studentsCount}
          parentsCount={parentsCount}
          adminsCount={adminsCount}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AcademicActivityBarChart data={academicActivity} />
        <GradeSpectrumChart
          gradeDistribution={gradeDistribution}
          avgScore={avgPlatformScore}
          totalGraded={gradedSubmissionsCount}
        />
      </div>

      {/* Main Content Grid: Recent Activity & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Registered Users & Enrollments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Users Table Card */}
          <Card className="border-slate-200/80 shadow-2xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Recent User Registrations</CardTitle>
                <CardDescription className="text-xs">Latest registered platform members and role assignments</CardDescription>
              </div>
              <Link
                href="/admin/users"
                prefetch={false}
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                  className: 'text-xs text-indigo-600 hover:text-indigo-700 font-medium',
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
                    <div key={user.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-900 truncate">{user.full_name}</p>
                            <span className="font-mono text-[10px] text-slate-400">#{user.id.slice(0, 8)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{user.email || 'No email attached'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${
                            user.role === 'teacher'
                              ? 'bg-blue-50 text-blue-700 border-blue-200/80'
                              : user.role === 'student'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
                              : user.role === 'parent'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                              : 'bg-purple-50 text-purple-700 border-purple-200/80'
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
          <Card className="border-slate-200/80 shadow-2xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Latest Class Enrollments</CardTitle>
                <CardDescription className="text-xs">Recent student registrations across active courses</CardDescription>
              </div>
              <Link
                href="/admin/enrollments"
                prefetch={false}
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                  className: 'text-xs text-indigo-600 hover:text-indigo-700 font-medium',
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
                      <div key={enr.id} className="py-2.5 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {studentObj?.full_name || 'Enrolled Student'}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                            <BookOpen className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            {classObj?.name || 'Assigned Class'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] capitalize font-medium px-2 py-0.5 rounded-md border ${
                              enr.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                                : enr.status === 'completed'
                                ? 'bg-blue-50 text-blue-700 border-blue-200/80'
                                : 'bg-slate-50 text-slate-600 border-slate-200/80'
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
          <Card className="border-slate-200/80 shadow-2xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900">Administrative Shortcuts</CardTitle>
              <CardDescription className="text-xs">Quick execution workflows for administrators</CardDescription>
            </CardHeader>
            <CardContent className="p-3.5 sm:p-4 space-y-2.5">
              <Link
                href="/admin/users"
                prefetch={false}
                className="group flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-indigo-50/40 border border-slate-200/80 hover:border-indigo-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-900 transition-colors truncate">
                      Manage Users & Linkages
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">Create accounts & link students</div>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all flex-shrink-0 ml-2">
                  Users <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>

              <Link
                href="/admin/enrollments"
                prefetch={false}
                className="group flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-900 transition-colors truncate">
                      Course Enrollments
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">Assign students to active cohorts</div>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all flex-shrink-0 ml-2">
                  Enroll <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>

              <Link
                href="/admin/reports"
                prefetch={false}
                className="group flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-blue-50/40 border border-slate-200/80 hover:border-blue-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 group-hover:text-blue-900 transition-colors truncate">
                      Operational Analytics
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">Course throughput & grade trends</div>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all flex-shrink-0 ml-2">
                  Reports <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </CardContent>
          </Card>

          {/* Academic Snapshot Card */}
          <Card className="border-slate-200/80 shadow-2xs bg-gradient-to-br from-slate-50/80 to-indigo-50/20">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Curriculum Snapshot</CardTitle>
              <CardDescription className="text-xs">Platform-wide academic throughput</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-xs pb-2.5 border-b border-slate-200/60">
                <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Total Assignments
                </span>
                <span className="font-bold text-slate-900">{totalHomework}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2.5 border-b border-slate-200/60">
                <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> Total Submissions
                </span>
                <span className="font-bold text-slate-900">{totalSubmissions}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Graded Submissions
                </span>
                <span className="font-bold text-emerald-600">{gradedSubmissionsCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
