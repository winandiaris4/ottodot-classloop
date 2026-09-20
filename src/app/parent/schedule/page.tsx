import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, ArrowLeft, User, Video, Users } from 'lucide-react'

export default async function ParentSchedulePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Fetch Linked Children
  const { data: parentLinks } = await supabase
    .from('parent_student_links')
    .select('student_id')
    .eq('parent_id', user?.id || '')

  const childIds = parentLinks?.map((l) => l.student_id) || []

  // 2. Fetch Enrolled Class IDs
  let classIds: string[] = []
  if (childIds.length > 0) {
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('class_id')
      .in('student_id', childIds)
      .eq('status', 'active')

    classIds = enrollments?.map((e) => e.class_id) || []
  }

  // 3. Fetch Class Sessions
  let sessions: Array<{
    id: string
    starts_at: string
    ends_at: string
    notes: string | null
    className: string
    teacherName: string
  }> = []

  if (classIds.length > 0) {
    const { data: sessionData } = await supabase
      .from('class_sessions')
      .select(`
        id, starts_at, ends_at, notes, class_id,
        classes:class_id (
          name,
          teacher:teacher_id (full_name)
        )
      `)
      .in('class_id', classIds)
      .order('starts_at', { ascending: true })

    if (sessionData) {
      sessions = sessionData.map((s) => {
        const classObj = s.classes as { name?: string; teacher?: { full_name?: string } } | null
        return {
          id: s.id,
          starts_at: s.starts_at,
          ends_at: s.ends_at,
          notes: s.notes,
          className: classObj?.name || 'Class',
          teacherName: classObj?.teacher?.full_name || 'Instructor',
        }
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="space-y-1">
        <Link
          href="/parent/dashboard"
          className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Family Class Schedule</h2>
        <p className="text-xs text-slate-500">
          Upcoming live classes and virtual sessions for your enrolled children.
        </p>
      </div>

      {/* Schedule List */}
      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session) => {
            const startDate = new Date(session.starts_at)
            const endDate = new Date(session.ends_at)
            const isToday = startDate.toDateString() === new Date().toDateString()
            const isPast = endDate < new Date()

            return (
              <Card
                key={session.id}
                className={`border transition-colors ${
                  isToday
                    ? 'border-amber-300 bg-amber-50/30 ring-1 ring-amber-400/40'
                    : isPast
                    ? 'border-slate-200 bg-slate-50/60 opacity-80'
                    : 'border-slate-200/80 bg-white'
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-amber-100 border border-amber-200 text-amber-900 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] uppercase font-bold tracking-wider">
                          {startDate.toLocaleDateString(undefined, { month: 'short' })}
                        </span>
                        <span className="text-lg font-extrabold leading-none">{startDate.getDate()}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] bg-white">
                            {session.className}
                          </Badge>
                          {isToday && (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]">
                              Today's Session
                            </Badge>
                          )}
                          {isPast && (
                            <Badge variant="secondary" className="text-[10px]">
                              Completed
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-bold text-sm text-slate-900">{session.notes || 'Interactive Live Session'}</h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" /> Instructor: {session.teacherName}
                          </span>
                        </div>
                      </div>
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
            <Calendar className="w-12 h-12 mx-auto text-slate-300" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-800">No scheduled sessions</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No upcoming class sessions found for your children at this time.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

