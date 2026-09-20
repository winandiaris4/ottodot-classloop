import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Calendar, CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import { CreateHomeworkDialog } from './CreateHomeworkDialog'

export default async function TeacherHomeworkPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Fetch Teacher's classes for the create homework dropdown
  const { data: classes } = await supabase
    .from('classes')
    .select('id, name')
    .eq('teacher_id', user?.id || '')
    .order('name', { ascending: true })

  // 2. Fetch Homework list
  const { data: homeworkList } = await supabase
    .from('homework')
    .select(`
      id, title, description, due_at, max_score, status, created_at,
      classes:class_id (name),
      submissions:homework_submissions (id, score, submitted_at)
    `)
    .eq('teacher_id', user?.id || '')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Homework & Grading</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign interactive science experiments, review student responses, and provide graded feedback.
          </p>
        </div>
        <CreateHomeworkDialog classes={classes || []} />
      </div>

      {/* Homework List Grid */}
      {homeworkList && homeworkList.length > 0 ? (
        <div className="space-y-4">
          {homeworkList.map((hw) => {
            const className = (hw.classes as { name?: string } | null)?.name || 'Class'
            const totalSubmissions = hw.submissions?.length || 0
            const gradedSubmissions = hw.submissions?.filter((s) => s.score !== null).length || 0
            const pendingSubmissions = totalSubmissions - gradedSubmissions
            const isOverdue = new Date(hw.due_at) < new Date()

            return (
              <Card key={hw.id} className="border-slate-200/80 hover:border-slate-300 transition-colors shadow-xs">
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-[10px] bg-slate-50 font-medium">
                          {className}
                        </Badge>
                        <Badge
                          variant={hw.status === 'published' ? 'default' : 'secondary'}
                          className="text-[10px] capitalize"
                        >
                          {hw.status}
                        </Badge>
                        {isOverdue && hw.status === 'published' && (
                          <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200">
                            Deadline Passed
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{hw.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{hw.description}</p>

                      <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Due: {new Date(hw.due_at).toLocaleDateString()} at {new Date(hw.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span>•</span>
                        <span>Max: {hw.max_score} pts</span>
                      </div>
                    </div>

                    {/* Submission Metrics & Action */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <div className="text-xs font-semibold text-slate-800">
                          {totalSubmissions} Submissions
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          {pendingSubmissions > 0 ? (
                            <span className="text-amber-600 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {pendingSubmissions} need review
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> All graded
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/teacher/homework/${hw.id}/submissions`}
                        className={buttonVariants({
                          size: 'sm',
                          variant: pendingSubmissions > 0 ? 'default' : 'outline',
                          className: pendingSubmissions > 0 ? 'bg-amber-600 hover:bg-amber-700 text-white text-xs' : 'text-xs',
                        })}
                      >
                        Review Submissions <ArrowRight className="w-3 h-3 ml-1.5" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-slate-200/80">
          <CardContent className="py-16 text-center text-slate-400 space-y-3">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-800">No homework created</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first homework assignment by clicking "Create Homework" above.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
