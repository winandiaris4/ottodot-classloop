import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  BookOpen,
  School,
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileCheck,
  Percent,
} from 'lucide-react'

export default async function AdminReportsPage() {
  const supabase = await createClient()

  // Execute all reporting queries in parallel (1 network roundtrip)
  const [
    { data: classes = [] },
    { data: enrollments = [] },
    { data: homework = [] },
    { data: submissions = [] },
  ] = await Promise.all([
    supabase
      .from('classes')
      .select('id, name, description, max_students, status, created_at, teacher:teacher_id(full_name)')
      .order('name', { ascending: true }),
    supabase.from('enrollments').select('id, class_id, student_id, status'),
    supabase.from('homework').select('id, class_id, title, max_score'),
    supabase
      .from('homework_submissions')
      .select(`
        id,
        score,
        feedback,
        submitted_at,
        graded_at,
        homework_id,
        student:student_id(full_name),
        homework:homework_id(title, class_id, max_score)
      `)
      .order('graded_at', { ascending: false }),
  ])

  const safeClasses = classes || []
  const safeEnrollments = enrollments || []
  const safeHomework = homework || []
  const safeSubmissions = submissions || []

  const totalClasses = safeClasses.length
  const totalHomework = safeHomework.length
  const totalSubmissions = safeSubmissions.length
  const gradedSubmissions = safeSubmissions.filter((s) => s.graded_at !== null)

  // Overall platform average score
  let overallAvgScore = 0
  if (gradedSubmissions.length > 0) {
    const sum = gradedSubmissions.reduce((acc, curr) => acc + (curr.score || 0), 0)
    overallAvgScore = Math.round(sum / gradedSubmissions.length)
  }

  // Graded rate %
  const gradedRate = totalSubmissions > 0 ? Math.round((gradedSubmissions.length / totalSubmissions) * 100) : 0

  // Class analytics breakdown
  const classReports = safeClasses.map((cls) => {
    const teacherObj = Array.isArray(cls.teacher) ? cls.teacher[0] : cls.teacher
    const teacherName = teacherObj?.full_name || 'Assigned Instructor'

    const classEnrollments = safeEnrollments.filter((e) => e.class_id === cls.id && e.status === 'active')
    const classHomework = safeHomework.filter((h) => h.class_id === cls.id)
    const classHwIds = new Set(classHomework.map((h) => h.id))

    const classSubmissions = safeSubmissions.filter((s) => classHwIds.has(s.homework_id))
    const classGraded = classSubmissions.filter((s) => s.graded_at !== null)

    let classAvgScore = 0
    if (classGraded.length > 0) {
      const sum = classGraded.reduce((acc, curr) => acc + (curr.score || 0), 0)
      classAvgScore = Math.round(sum / classGraded.length)
    }

    // Expected submissions = enrolled students * total homework assignments
    const expectedSubmissions = classEnrollments.length * classHomework.length
    const completionRate =
      expectedSubmissions > 0 ? Math.min(100, Math.round((classSubmissions.length / expectedSubmissions) * 100)) : 0

    return {
      id: cls.id,
      name: cls.name,
      teacherName,
      enrolledCount: classEnrollments.length,
      maxStudents: cls.max_students,
      homeworkCount: classHomework.length,
      submissionsCount: classSubmissions.length,
      gradedCount: classGraded.length,
      avgScore: classGraded.length > 0 ? classAvgScore : null,
      completionRate,
      status: cls.status,
    }
  })

  // Recent graded submissions
  const recentGraded = safeSubmissions.filter((s) => s.graded_at !== null).slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Academic & Platform Reports</h2>
        <p className="text-xs text-slate-500">
          Cross-sectional metrics, homework turnaround rates, and individual course performance analytics
        </p>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Courses
            </CardTitle>
            <School className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalClasses}</div>
            <p className="text-[11px] text-slate-500 mt-1">{totalHomework} total assignments assigned</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Submissions Received
            </CardTitle>
            <FileCheck className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalSubmissions}</div>
            <p className="text-[11px] text-slate-500 mt-1">{gradedSubmissions.length} evaluated by teachers</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Grading Turnaround
            </CardTitle>
            <Percent className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{gradedRate}%</div>
            <p className="text-[11px] text-slate-500 mt-1">
              {totalSubmissions - gradedSubmissions.length} pending review
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Platform Avg. Grade
            </CardTitle>
            <Award className="w-4 h-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {gradedSubmissions.length > 0 ? `${overallAvgScore}%` : 'N/A'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Across all evaluated tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Class Performance Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Course Academic Performance Breakdown</h3>
            <p className="text-xs text-slate-500">
              Comparative completion rate and average assignment score across each live course
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-semibold border-slate-200">
            {classReports.length} Active Courses
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Course / Subject</th>
                <th className="px-4 py-3">Instructor</th>
                <th className="px-4 py-3">Enrollment</th>
                <th className="px-4 py-3">Assignments</th>
                <th className="px-4 py-3">Turnaround</th>
                <th className="px-4 py-3">Avg. Score</th>
                <th className="px-4 py-3">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classReports.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div>{c.name}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{c.status}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{c.teacherName}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="font-semibold text-slate-900">{c.enrolledCount}</span> / {c.maxStudents} seats
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.homeworkCount} tasks</td>
                  <td className="px-4 py-3 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-emerald-600">{c.gradedCount}</span>
                      <span className="text-slate-400">/ {c.submissionsCount} submitted</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {c.avgScore !== null ? (
                      <Badge
                        variant="secondary"
                        className={`text-xs font-bold ${
                          c.avgScore >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.avgScore >= 60
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {c.avgScore}%
                      </Badge>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">No graded tasks</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${c.completionRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{c.completionRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Teacher Evaluations & Feedback Feed */}
      <Card className="border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">Recent Graded Homework Evaluations</CardTitle>
          <CardDescription className="text-xs">
            Live stream of teacher grading notes and academic feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentGraded.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">No graded homework submissions yet.</div>
          ) : (
            <div className="space-y-3">
              {recentGraded.map((sub: any) => {
                const studentName = Array.isArray(sub.student) ? sub.student[0]?.full_name : sub.student?.full_name
                const hwTitle = Array.isArray(sub.homework) ? sub.homework[0]?.title : sub.homework?.title
                const maxScore = Array.isArray(sub.homework) ? sub.homework[0]?.max_score : sub.homework?.max_score

                return (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{studentName || 'Student'}</span>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-xs text-indigo-700 font-medium truncate">{hwTitle}</span>
                      </div>
                      {sub.feedback && (
                        <p className="text-xs text-slate-600 italic bg-white p-2 rounded border border-slate-200/60">
                          &ldquo;{sub.feedback}&rdquo;
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-700">
                          {sub.score} / {maxScore || 100} pts
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {sub.graded_at
                            ? new Date(sub.graded_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })
                            : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
