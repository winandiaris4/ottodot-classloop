'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, TrendingUp } from 'lucide-react'
import type { GradeDistributionStat } from '@/lib/cache/dashboard-cache'

interface GradeSpectrumChartProps {
  gradeDistribution: GradeDistributionStat[]
  avgScore: number
  totalGraded: number
}

export function GradeSpectrumChart({
  gradeDistribution = [],
  avgScore = 0,
  totalGraded = 0,
}: GradeSpectrumChartProps) {
  return (
    <Card className="border-slate-200/80 shadow-2xs h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-rose-600" /> Grade Mastery & Score Spectrum
          </CardTitle>
          <CardDescription className="text-xs">
            Student score distribution across all evaluated assignments
          </CardDescription>
        </div>
        <Badge
          variant="secondary"
          className={`text-xs font-bold ${
            avgScore >= 80
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
              : 'bg-indigo-50 text-indigo-700 border border-indigo-200/80'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 mr-1" />
          {totalGraded > 0 ? `${avgScore}% Platform Avg` : 'No Grades'}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
        {/* Continuous Segmented Spectrum Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
            {gradeDistribution.map((item) => (
              <div
                key={item.grade}
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
                className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                title={`${item.label}: ${item.count} submissions (${item.percentage}%)`}
              />
            ))}
          </div>
        </div>

        {/* 4-Column Grade Bracket Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {gradeDistribution.map((tier) => (
            <div
              key={tier.grade}
              className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/60 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded font-bold text-xs text-white"
                  style={{ backgroundColor: tier.color }}
                >
                  {tier.grade}
                </span>
                <span className="text-xs font-bold font-mono text-slate-800">{tier.percentage}%</span>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-700 truncate">{tier.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{tier.count} submissions</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Total Evaluations Analyzed:</span>
          <span className="font-bold text-slate-900">{totalGraded} graded submissions</span>
        </div>
      </CardContent>
    </Card>
  )
}

