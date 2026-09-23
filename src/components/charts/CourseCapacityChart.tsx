'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { School, Users } from 'lucide-react'
import type { ClassCapacityStat } from '@/lib/cache/dashboard-cache'

interface CourseCapacityChartProps {
  data: ClassCapacityStat[]
}

export function CourseCapacityChart({ data = [] }: CourseCapacityChartProps) {
  const totalEnrolled = data.reduce((sum, item) => sum + item.enrolled, 0)
  const totalCapacity = data.reduce((sum, item) => sum + item.maxStudents, 0)
  const avgUtilization = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0

  return (
    <Card className="border-slate-200/80 shadow-2xs h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <School className="w-4 h-4 text-blue-600" /> Course Enrollment & Capacity
          </CardTitle>
          <CardDescription className="text-xs">
            Student cohort saturation across active STEM classrooms
          </CardDescription>
        </div>
        <Badge
          variant="secondary"
          className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80"
        >
          {avgUtilization}% Avg Saturation
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
        {data.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">No active course capacity data.</div>
        ) : (
          <div className="space-y-3.5">
            {data.map((item) => {
              const isHigh = item.percentage >= 80
              const isMedium = item.percentage >= 50 && item.percentage < 80
              const barColor = isHigh
                ? 'bg-emerald-500'
                : isMedium
                ? 'bg-indigo-500'
                : 'bg-blue-500'

              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-slate-500 text-[11px]">
                        <span className="font-bold text-slate-900">{item.enrolled}</span> / {item.maxStudents} seats
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                          isHigh
                            ? 'bg-emerald-50 text-emerald-700'
                            : isMedium
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {item.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                    <div
                      style={{ width: `${item.percentage}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Aggregate Footer Info */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Total Student Placements:</span>
            <span className="font-bold text-slate-900">{totalEnrolled}</span>
          </div>
          <div>
            <span>Platform Capacity:</span> <span className="font-bold text-slate-900">{totalCapacity}</span> seats
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

