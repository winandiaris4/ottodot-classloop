import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function TeacherDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="h-3.5 w-24 bg-slate-200 rounded" />
              <div className="h-4 w-4 bg-slate-200 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="h-7 w-12 bg-slate-200 rounded mb-2" />
              <div className="h-3 w-32 bg-slate-100 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200/80">
            <CardHeader>
              <div className="h-5 w-48 bg-slate-200 rounded mb-1" />
              <div className="h-3.5 w-36 bg-slate-100 rounded" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-50 rounded-xl border border-slate-100" />
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="border-slate-200/80">
            <CardHeader>
              <div className="h-5 w-36 bg-slate-200 rounded" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-14 bg-slate-50 rounded-xl border border-slate-100" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

