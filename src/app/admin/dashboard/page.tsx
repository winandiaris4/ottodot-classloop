import React, { Suspense } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Users, CreditCard, BarChart3, Activity } from 'lucide-react'
import { AdminDashboardData } from '@/components/admin/AdminDashboardData'
import { AdminDashboardSkeleton } from '@/components/admin/AdminDashboardSkeleton'

export default function AdminDashboardPage() {
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())

  return (
    <div className="space-y-6">
      {/* Enterprise Executive Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              System Overview
            </h1>
            <Badge
              variant="outline"
              className="bg-emerald-50/80 text-emerald-700 border-emerald-200 text-[11px] font-medium py-0.5 px-2 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            Real-time administrative metrics, user accounts, course enrollments, and academic performance.
          </p>
        </div>

        {/* Header Metadata & Quick Navigation */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/80 border border-slate-200/70 px-3 py-1.5 rounded-lg">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">{todayFormatted}</span>
          </div>

          <Link
            href="/admin/users"
            prefetch={false}
            className={buttonVariants({
              variant: 'outline',
              size: 'sm',
              className: 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs shadow-2xs',
            })}
          >
            <Users className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Users
          </Link>

          <Link
            href="/admin/enrollments"
            prefetch={false}
            className={buttonVariants({
              variant: 'outline',
              size: 'sm',
              className: 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs shadow-2xs',
            })}
          >
            <CreditCard className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Enrollments
          </Link>

          <Link
            href="/admin/reports"
            prefetch={false}
            className={buttonVariants({
              variant: 'outline',
              size: 'sm',
              className: 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs shadow-2xs',
            })}
          >
            <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Analytics
          </Link>
        </div>
      </div>

      {/* Dynamic Database Queries streamed asynchronously */}
      <Suspense fallback={<AdminDashboardSkeleton />}>
        <AdminDashboardData />
      </Suspense>
    </div>
  )
}
