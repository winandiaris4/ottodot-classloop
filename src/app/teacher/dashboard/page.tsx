import React, { Suspense } from 'react'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'
import { TeacherDashboardData } from '@/components/teacher/TeacherDashboardData'
import { TeacherDashboardSkeleton } from '@/components/teacher/TeacherDashboardSkeleton'

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner (Immediate LCP Element) */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-xl space-y-2">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs font-semibold">
            <Sparkles className="w-3 h-3 mr-1" /> Teacher Workspace
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, Educator! 🎓
          </h2>
          <p className="text-blue-200 text-sm">
            Track student submissions, publish interactive assignments, and oversee class participation.
          </p>
        </div>
      </div>

      {/* Dynamic Database Queries streamed asynchronously */}
      <Suspense fallback={<TeacherDashboardSkeleton />}>
        <TeacherDashboardData />
      </Suspense>
    </div>
  )
}
