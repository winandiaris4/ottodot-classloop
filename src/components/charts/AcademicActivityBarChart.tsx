'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3 } from 'lucide-react'
import type { AcademicActivityStat } from '@/lib/cache/dashboard-cache'

interface AcademicActivityBarChartProps {
  data: AcademicActivityStat[]
}

export function AcademicActivityBarChart({ data = [] }: AcademicActivityBarChartProps) {
  // Find max value to normalize bar heights
  const maxVal = Math.max(
    1,
    ...data.flatMap((d) => [d.tasks, d.submissions, d.graded])
  )

  const totalTasks = data.reduce((sum, d) => sum + d.tasks, 0)
  const totalSubmissions = data.reduce((sum, d) => sum + d.submissions, 0)
  const totalGraded = data.reduce((sum, d) => sum + d.graded, 0)

  return (
    <Card className="border-slate-200/80 shadow-2xs h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" /> Academic Turnaround & Submissions
          </CardTitle>
          <CardDescription className="text-xs">
            Homework tasks assigned vs submitted vs graded across courses
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[11px] font-semibold border-slate-200">
            {totalSubmissions} Total Hand-ins
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
        {/* Legend */}
        <div className="flex items-center justify-end gap-4 text-[11px] font-medium text-slate-600 pb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-slate-300" />
            <span>Assigned Tasks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500" />
            <span>Submissions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            <span>Graded Reviews</span>
          </div>
        </div>

        {/* Bar Chart Grid */}
        {data.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">No academic activity recorded.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end pt-4 pb-2 border-b border-slate-100 min-h-[160px]">
            {data.map((item, idx) => {
              const tasksHeight = Math.max(8, (item.tasks / maxVal) * 100)
              const subsHeight = Math.max(8, (item.submissions / maxVal) * 100)
              const gradedHeight = Math.max(8, (item.graded / maxVal) * 100)

              return (
                <div key={idx} className="flex flex-col items-center gap-2 group">
                  {/* Bars Cluster */}
                  <div className="flex items-end gap-1.5 h-32 w-full justify-center">
                    {/* Tasks Bar */}
                    <div className="relative flex flex-col items-center justify-end h-full w-4">
                      <div
                        style={{ height: `${tasksHeight}%` }}
                        className="w-full bg-slate-200 hover:bg-slate-300 rounded-t transition-all duration-500 flex items-center justify-center group-hover:scale-y-[1.03]"
                        title={`${item.tasks} Tasks Assigned`}
                      />
                      <span className="text-[10px] font-mono text-slate-400 mt-1">{item.tasks}</span>
                    </div>

                    {/* Submissions Bar */}
                    <div className="relative flex flex-col items-center justify-end h-full w-4">
                      <div
                        style={{ height: `${subsHeight}%` }}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-t transition-all duration-500 flex items-center justify-center group-hover:scale-y-[1.03]"
                        title={`${item.submissions} Submissions`}
                      />
                      <span className="text-[10px] font-mono text-indigo-600 font-bold mt-1">
                        {item.submissions}
                      </span>
                    </div>

                    {/* Graded Bar */}
                    <div className="relative flex flex-col items-center justify-end h-full w-4">
                      <div
                        style={{ height: `${gradedHeight}%` }}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-t transition-all duration-500 flex items-center justify-center group-hover:scale-y-[1.03]"
                        title={`${item.graded} Graded`}
                      />
                      <span className="text-[10px] font-mono text-emerald-600 font-bold mt-1">{item.graded}</span>
                    </div>
                  </div>

                  {/* Course Name Label */}
                  <span className="text-[11px] font-semibold text-slate-700 text-center truncate max-w-[90px] pt-1">
                    {item.name}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Summary Footer */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
          <div>
            <span>Total Assigned:</span> <span className="font-bold text-slate-800">{totalTasks}</span> tasks
          </div>
          <div>
            <span>Evaluation Rate:</span>{' '}
            <span className="font-bold text-emerald-600">
              {totalSubmissions > 0 ? Math.round((totalGraded / totalSubmissions) * 100) : 0}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

