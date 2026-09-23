import React, { Suspense } from 'react'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'
import { ParentDashboardData } from '@/components/parent/ParentDashboardData'
import { ParentDashboardSkeleton } from '@/components/parent/ParentDashboardSkeleton'

export default function ParentDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner (Immediate LCP Element) */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-xl space-y-2">
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-xs font-semibold">
            <Sparkles className="w-3 h-3 mr-1" /> Parent Visibility Hub
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Stay connected with your child&apos;s learning journey 🌟
          </h2>
          <p className="text-amber-100 text-sm">
            Monitor real-time assignment submissions, view teacher evaluations, and keep track of live class schedules.
          </p>
        </div>
      </div>

      {/* Dynamic Database Queries streamed asynchronously */}
      <Suspense fallback={<ParentDashboardSkeleton />}>
        <ParentDashboardData />
      </Suspense>
    </div>
  )
}
