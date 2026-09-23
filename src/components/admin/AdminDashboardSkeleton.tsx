import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-slate-200/80 shadow-2xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="h-3.5 w-24 bg-slate-200 rounded" />
              <div className="h-5 w-5 bg-slate-200 rounded-lg" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-7 w-16 bg-slate-200 rounded" />
              <div className="h-3 w-full bg-slate-100 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Line Chart Skeleton */}
      <Card className="border-slate-200/80 shadow-2xs">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <div className="h-5 w-64 bg-slate-200 rounded" />
            <div className="h-3.5 w-80 bg-slate-100 rounded" />
          </div>
          <div className="h-7 w-48 bg-slate-100 rounded-lg" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-48 bg-slate-50 rounded-lg border border-slate-100" />
        </CardContent>
      </Card>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="border-slate-200/80 shadow-2xs">
            <CardHeader className="pb-3">
              <div className="h-5 w-44 bg-slate-200 rounded mb-1" />
              <div className="h-3.5 w-60 bg-slate-100 rounded" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-32 bg-slate-50 rounded-lg border border-slate-100" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="border-slate-200/80 shadow-2xs">
            <CardHeader className="pb-3">
              <div className="h-5 w-44 bg-slate-200 rounded mb-1" />
              <div className="h-3.5 w-60 bg-slate-100 rounded" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-32 bg-slate-50 rounded-lg border border-slate-100" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200/80">
            <CardHeader className="pb-3">
              <div className="h-5 w-48 bg-slate-200 rounded mb-1" />
              <div className="h-3.5 w-36 bg-slate-100 rounded" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-50 rounded border border-slate-100" />
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="border-slate-200/80">
            <CardHeader>
              <div className="h-5 w-40 bg-slate-200 rounded" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-50 rounded border border-slate-100" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

