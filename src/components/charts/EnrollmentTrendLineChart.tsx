'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Zap,
  Target,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import type { TrendDataPoint } from '@/lib/cache/dashboard-cache'

interface EnrollmentTrendLineChartProps {
  data: TrendDataPoint[]
}

export function EnrollmentTrendLineChart({ data = [] }: EnrollmentTrendLineChartProps) {
  const [activeMetric, setActiveMetric] = useState<'both' | 'students' | 'submissions'>('both')
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number>(750)

  // Measure exact container width dynamically via ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return
    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth
        if (w > 50) setContainerWidth(w)
      }
    }
    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  if (data.length === 0) return null

  // Chart dimensions in dynamic SVG viewBox - exact pixel binding
  const width = Math.max(320, containerWidth)
  const height = 210
  const paddingX = 28
  const paddingRight = 8
  const paddingY = 24
  const chartWidth = width - paddingX - paddingRight
  const chartHeight = height - paddingY * 2

  // Find max values for normalization with clean dynamic curve scale
  const rawMax = Math.max(1, ...data.map((d) => Math.max(d.students, d.submissions)))
  const maxValue = rawMax <= 2 ? 3 : rawMax <= 4 ? rawMax + 1 : Math.ceil(rawMax * 1.2)

  // Generate unique scale ticks
  const uniqueTicks = maxValue <= 3 ? [0, 1, 2, 3] : [0, 0.25, 0.5, 0.75, 1].map((r) => Math.round(r * maxValue))
  const displayTicks = Array.from(new Set(uniqueTicks)).sort((a, b) => a - b)

  // Coordinate mapper helper
  const getCoordinates = (values: number[]) => {
    return values.map((val, idx) => {
      const x = paddingX + (idx / (values.length - 1)) * chartWidth
      const y = height - paddingY - (val / maxValue) * chartHeight
      return { x, y, val }
    })
  }

  const studentPoints = getCoordinates(data.map((d) => d.students))
  const submissionPoints = getCoordinates(data.map((d) => d.submissions))

  // Build SVG smooth path command using cubic bezier curves
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return ''
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[Math.min(points.length - 1, i + 2)]

      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
    }
    return d
  }

  const studentPath = createSmoothPath(studentPoints)
  const submissionPath = createSmoothPath(submissionPoints)

  // Create area paths for background gradient fill
  const createAreaPath = (linePath: string, points: { x: number; y: number }[]) => {
    if (!linePath || points.length === 0) return ''
    const firstX = points[0].x
    const lastX = points[points.length - 1].x
    const bottomY = height - paddingY
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`
  }

  const studentAreaPath = createAreaPath(studentPath, studentPoints)
  const submissionAreaPath = createAreaPath(submissionPath, submissionPoints)

  // Growth & Statistical Calculations
  const firstStudents = data[0]?.students || 1
  const lastStudents = data[data.length - 1]?.students || 1
  const growthRate = Math.round(((lastStudents - firstStudents) / firstStudents) * 100)
  
  const totalSubmissionsAnnual = data.reduce((acc, d) => acc + d.submissions, 0)
  const avgSubmissionsPerMonth = (totalSubmissionsAnnual / data.length).toFixed(1)
  
  // Find Peak Activity Period
  const peakPeriod = data.reduce((max, d) => (d.submissions > max.submissions ? d : max), data[0])

  return (
    <Card className="border-slate-200/80 shadow-2xs overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" /> Annual Trajectory & Intake Momentum
            </CardTitle>
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-emerald-700 border-emerald-200/80 text-[10px] font-bold py-0.2"
            >
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +{growthRate}% 12M
            </Badge>
          </div>
          <CardDescription className="text-xs mt-0.5">
            12-Month annual intake velocity and student submission turnaround metrics
          </CardDescription>
        </div>

        {/* Metric Segmented Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveMetric('both')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              activeMetric === 'both' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Series
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('students')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              activeMetric === 'students' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
            Students
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('submissions')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              activeMetric === 'submissions' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            Submissions
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* Split 2-Column Internal Layout: Chart (70%) + Performance Highlights Panel (30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column (8 of 12 cols / ~67%): SVG Line Chart with Legend */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-3">
            <div ref={containerRef} className="relative w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-[210px] overflow-visible"
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <defs>
                  {/* Indigo Gradient */}
                  <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                  {/* Emerald Gradient */}
                  <linearGradient id="submissionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines & Y-Axis Scale Labels */}
                {displayTicks.map((tickVal) => {
                  const ratio = tickVal / maxValue
                  const y = height - paddingY - ratio * chartHeight
                  return (
                    <g key={tickVal}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={width - paddingRight}
                        y2={y}
                        stroke="#f1f5f9"
                        strokeDasharray={ratio === 0 ? 'none' : '4 4'}
                        strokeWidth={ratio === 0 ? '1.5' : '1'}
                      />
                      <text
                        x={paddingX - 6}
                        y={y + 3.5}
                        textAnchor="end"
                        className="text-[10px] fill-slate-500 font-mono font-semibold"
                      >
                        {tickVal}
                      </text>
                    </g>
                  )
                })}

                {/* Area Fill: Students */}
                {(activeMetric === 'both' || activeMetric === 'students') && (
                  <path d={studentAreaPath} fill="url(#studentGradient)" />
                )}

                {/* Area Fill: Submissions */}
                {(activeMetric === 'both' || activeMetric === 'submissions') && (
                  <path d={submissionAreaPath} fill="url(#submissionGradient)" />
                )}

                {/* Line: Students */}
                {(activeMetric === 'both' || activeMetric === 'students') && (
                  <path
                    d={studentPath}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />
                )}

                {/* Line: Submissions */}
                {(activeMetric === 'both' || activeMetric === 'submissions') && (
                  <path
                    d={submissionPath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />
                )}

                {/* Data Points & Vertical Hover Zones */}
                {data.map((item, idx) => {
                  const sp = studentPoints[idx]
                  const subp = submissionPoints[idx]
                  const isHovered = hoveredIdx === idx

                  return (
                    <g key={idx}>
                      {/* Invisible Hit Area for Hover */}
                      <rect
                        x={sp.x - chartWidth / (data.length - 1) / 2}
                        y={0}
                        width={chartWidth / (data.length - 1)}
                        height={height}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredIdx(idx)}
                      />

                      {/* Vertical Crosshair on Hover */}
                      {isHovered && (
                        <line
                          x1={sp.x}
                          y1={paddingY}
                          x2={sp.x}
                          y2={height - paddingY}
                          stroke="#94a3b8"
                          strokeDasharray="2 2"
                          strokeWidth="1.5"
                        />
                      )}

                      {/* Point: Student */}
                      {(activeMetric === 'both' || activeMetric === 'students') && (
                        <circle
                          cx={sp.x}
                          cy={sp.y}
                          r={isHovered ? 5 : 3}
                          fill="#ffffff"
                          stroke="#6366f1"
                          strokeWidth={isHovered ? 3 : 2}
                          className="transition-all duration-200"
                        />
                      )}

                      {/* Point: Submission */}
                      {(activeMetric === 'both' || activeMetric === 'submissions') && (
                        <circle
                          cx={subp.x}
                          cy={subp.y}
                          r={isHovered ? 5 : 3}
                          fill="#ffffff"
                          stroke="#10b981"
                          strokeWidth={isHovered ? 3 : 2}
                          className="transition-all duration-200"
                        />
                      )}

                      {/* X-Axis Label */}
                      <text
                        x={sp.x}
                        y={height - 6}
                        textAnchor="middle"
                        className={`text-[10px] font-semibold transition-colors ${
                          isHovered ? 'fill-slate-900 font-bold' : 'fill-slate-400'
                        }`}
                      >
                        {item.period}
                      </text>
                    </g>
                  )
                })}
              </svg>

              {/* Interactive Hover Card Tooltip with Smart Edge Docking */}
              {hoveredIdx !== null && data[hoveredIdx] && (
                <div
                  style={{
                    left: `${(studentPoints[hoveredIdx].x / width) * 100}%`,
                    top: '12px',
                  }}
                  className={`absolute pointer-events-none bg-slate-900/95 text-white backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700/90 text-xs space-y-1.5 z-30 min-w-[140px] whitespace-nowrap transition-transform duration-100 ${
                    hoveredIdx >= data.length - 3
                      ? '-translate-x-full -ml-3'
                      : hoveredIdx <= 1
                      ? 'translate-x-3'
                      : '-translate-x-1/2'
                  }`}
                >
                  <div className="font-bold text-slate-200 border-b border-slate-700/80 pb-1 text-[11px]">
                    Period: {data[hoveredIdx].period} 2026
                  </div>
                  <div className="flex items-center justify-between gap-4 text-[11px]">
                    <span className="flex items-center gap-1.5 text-indigo-300">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" /> Students:
                    </span>
                    <span className="font-bold font-mono text-white">{data[hoveredIdx].students}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-[11px]">
                    <span className="flex items-center gap-1.5 text-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Submissions:
                    </span>
                    <span className="font-bold font-mono text-white">{data[hoveredIdx].submissions}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Series Legend */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 rounded-full bg-indigo-600" />
                  <span className="text-slate-700 font-medium">Active Students (Trajectory)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 rounded-full bg-emerald-600" />
                  <span className="text-slate-700 font-medium">Homework Submissions</span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">12-Month Annual Baseline</span>
            </div>
          </div>

          {/* Right Column (4 of 12 cols / ~33%): Mini Performance Metrics & Insights Sidebar */}
          <div className="lg:col-span-4 bg-gradient-to-br from-slate-50 to-indigo-50/30 p-4 rounded-xl border border-slate-200/80 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Trajectory Insights
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                12M Live
              </span>
            </div>

            {/* Metric Item 1: Turnaround Velocity */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Turnaround Velocity</p>
                  <p className="text-[10px] text-slate-500">{avgSubmissionsPerMonth} hand-ins / month avg</p>
                </div>
              </div>
              <span className="font-bold text-slate-900 font-mono text-sm">{totalSubmissionsAnnual}</span>
            </div>

            {/* Metric Item 2: Peak Activity Month */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Peak Month Volume</p>
                  <p className="text-[10px] text-slate-500">{peakPeriod.submissions} submissions peak</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[11px] font-bold bg-white text-blue-700 border-blue-200">
                {peakPeriod.period} 2026
              </Badge>
            </div>

            {/* Metric Item 3: Cohort Retention & Punctuality */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Intake Retention</p>
                  <p className="text-[10px] text-slate-500">100% active cohort index</p>
                </div>
              </div>
              <span className="font-bold text-emerald-600 font-mono text-sm">100%</span>
            </div>

            {/* Status footer badge */}
            <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>Intake trajectory trending positively across cohorts</span>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}


