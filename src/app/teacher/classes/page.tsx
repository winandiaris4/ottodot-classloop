import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { School, Users, BookOpen, ArrowRight } from 'lucide-react'
import { CreateClassDialog } from './CreateClassDialog'

export default async function TeacherClassesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: classes } = await supabase
    .from('classes')
    .select(`
      id, name, description, max_students, status, created_at,
      enrollments:enrollments (id, status),
      homework:homework (id)
    `)
    .eq('teacher_id', user?.id || '')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Class Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, manage rosters, and organize homework assignments across your active classrooms.
          </p>
        </div>
        <CreateClassDialog />
      </div>

      {/* Classes Grid */}
      {classes && classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map((c) => {
            const activeEnrollments = c.enrollments?.filter((e) => e.status === 'active') || []
            const homeworkCount = c.homework?.length || 0

            return (
              <Card key={c.id} className="border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <School className="w-4 h-4" />
                    </div>
                    <Badge variant={c.status === 'active' ? 'default' : 'secondary'} className="text-[10px] capitalize">
                      {c.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 mt-2 line-clamp-1">{c.name}</CardTitle>
                  <CardDescription className="text-xs text-slate-500 line-clamp-2 min-h-8">
                    {c.description || 'No description provided.'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 border-t border-slate-100 mt-2">
                  <div className="grid grid-cols-2 gap-2 py-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activeEnrollments.length} / {c.max_students} students</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>{homeworkCount} assignments</span>
                    </div>
                  </div>

                  <Link
                    href={`/teacher/classes/${c.id}`}
                    className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full text-xs font-medium justify-between' })}
                  >
                    <span>View Student Roster</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-slate-200/80">
          <CardContent className="py-16 text-center text-slate-400 space-y-3">
            <School className="w-12 h-12 mx-auto text-slate-300" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-800">No classes found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven't created any classes yet. Click "Create New Class" to begin.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
