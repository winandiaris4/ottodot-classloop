import React, { Suspense } from 'react'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'
import { StudentDashboardData } from '@/components/student/StudentDashboardData'
import { StudentDashboardSkeleton } from '@/components/student/StudentDashboardSkeleton'

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner (Immediate LCP Element) */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-xl space-y-2">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs font-semibold">
            <Sparkles className="w-3 h-3 mr-1" /> Student Space
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready for your next learning mission? 🚀
          </h2>
          <p className="text-indigo-200 text-sm">
            Check your pending assignments, review teacher feedback, and prepare for upcoming live classes.
          </p>
        </div>
      </div>

      {/* Dynamic Data Content Streamed via Suspense */}
      <Suspense fallback={<StudentDashboardSkeleton />}>
        <StudentDashboardData />
      </Suspense>
    </div>
  )
}
