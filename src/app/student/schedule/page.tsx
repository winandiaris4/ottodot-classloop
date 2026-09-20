import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Video, BookOpen, ArrowRight, User } from 'lucide-react'

export default async function StudentSchedulePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Fetch Enrolled Class IDs
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('class_id')
    .eq('student_id', user?.id || '')
    .eq('status', 'active')

  const enrolledClassIds = enrollments?.map((e) => e.class_id) || []

  // 2. Fetch Sessions
  let sessions: Array<{
    id: string
    starts_at: string
    ends_at: string
    notes: string | null
    className: string
    teacherName: string
  }> = []

  if (enrolledClassIds.length > 0) {
    const { data: sessionData } = await supabase
      .from('class_sessions')
      .select(`
        id, starts_at, ends_at, notes, class_id,
        classes:class_id (
          name,
          teacher:teacher_id (full_name)
        )
      `)
      .in('class_id', enrolledClassIds)
      .order('starts_at', { ascending: true })

    if (sessionData) {
      sessions = sessionData.map((s) => {
        const classObj = s.classes as { name?: string; teacher?: { full_name?: string } } | null
        return {
          id: s.id,
          starts_at: s.starts_at,
          ends_at: s.ends_at,
          notes: s.notes,
          className: classObj?.name || 'Live Class',
          teacherName: classObj?.teacher?.full_name || 'Instructor',
        }
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Live Class Schedule</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          View your upcoming interactive sessions, lab times, and live experiment dates.
        </p>
      </div>

      {/* Schedule Timeline Grid */}
      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session) => {
            const startDate = new Date(session.starts_at)
            const endDate = new Date(session.ends_at)
            const isPast = endDate < new Date()
            const isToday = startDate.toDateString() === new Date().toDateString()

            return (
              <Card
                key={session.id}
                className={`border transition-colors ${
                  isToday
                    ? 'border-indigo-300 bg-indigo-50/30 ring-1 ring-indigo-400/40'
                    : isPast
                    ? 'border-slate-200 bg-slate-50/60 opacity-80'
                    : 'border-slate-200/80 bg-white'
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Date Badge & Details */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-800 flex flex-col items-center justify-center shrink-0">
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
                              Happening Today
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

                    {/* Right: Join Button */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={isPast}
                        className={buttonVariants({
                          size: 'sm',
                          variant: isPast ? 'outline' : 'default',
                          className: isPast
                            ? 'text-xs text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium',
                        })}
                      >
                        <Video className="w-3.5 h-3.5 mr-1.5" />
                        {isPast ? 'Session Ended' : 'Join Live Class'}
                      </button>
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
                There are no scheduled class sessions for your enrolled courses at this moment.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
