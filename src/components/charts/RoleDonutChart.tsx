'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, ShieldCheck, School, GraduationCap, HeartHandshake } from 'lucide-react'

interface RoleDonutChartProps {
  totalUsers: number
  teachersCount: number
  studentsCount: number
  parentsCount: number
  adminsCount: number
}

export function RoleDonutChart({
  totalUsers = 0,
  teachersCount = 0,
  studentsCount = 0,
  parentsCount = 0,
  adminsCount = 0,
}: RoleDonutChartProps) {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)

  const roles = [
    { id: 'students', label: 'Students', count: studentsCount, color: '#6366f1', icon: GraduationCap },
    { id: 'teachers', label: 'Teachers', count: teachersCount, color: '#3b82f6', icon: School },
    { id: 'parents', label: 'Parents', count: parentsCount, color: '#10b981', icon: HeartHandshake },
    { id: 'admins', label: 'Admins', count: adminsCount, color: '#a855f7', icon: ShieldCheck },
  ]

  // SVG Donut Calculations (Circumference of radius 40 = 2 * PI * 40 = 251.327)
  const radius = 40
  const circumference = 2 * Math.PI * radius
  let accumulatedOffset = 0

  const slices = roles.map((role) => {
    const fraction = totalUsers > 0 ? role.count / totalUsers : 0
    const strokeDasharray = `${fraction * circumference} ${circumference}`
    const strokeDashoffset = -accumulatedOffset
    accumulatedOffset += fraction * circumference
    const percentage = totalUsers > 0 ? Math.round(fraction * 100) : 0

    return {
      ...role,
      strokeDasharray,
      strokeDashoffset,
      percentage,
    }
  })

  return (
    <Card className="border-slate-200/80 shadow-2xs h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" /> User Roles & Demographics
          </CardTitle>
          <CardDescription className="text-xs">
            Distribution of registered identities across platform portals
          </CardDescription>
        </div>
        <Badge variant="outline" className="text-xs font-semibold border-slate-200">
          {totalUsers} Accounts
        </Badge>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-around">
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
          {/* SVG Donut Ring */}
          <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-100"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Data Slices */}
              {slices.map((slice) => {
                const isHovered = hoveredRole === slice.id
                return (
                  <circle
                    key={slice.id}
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={slice.color}
                    strokeWidth={isHovered ? 14 : 12}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredRole(slice.id)}
                    onMouseLeave={() => setHoveredRole(null)}
                  />
                )
              })}
            </svg>

            {/* Centered Total Indicator */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold text-slate-900 leading-tight">
                {hoveredRole ? roles.find((r) => r.id === hoveredRole)?.count : totalUsers}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {hoveredRole ? roles.find((r) => r.id === hoveredRole)?.label : 'Users'}
              </span>
            </div>
          </div>

          {/* Breakdown Legend Grid */}
          <div className="grid grid-cols-2 gap-2.5 w-full sm:w-auto">
            {slices.map((slice) => {
              const Icon = slice.icon
              const isHovered = hoveredRole === slice.id
              return (
                <div
                  key={slice.id}
                  onMouseEnter={() => setHoveredRole(slice.id)}
                  onMouseLeave={() => setHoveredRole(null)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isHovered
                      ? 'bg-slate-100/90 border-slate-300 shadow-2xs scale-[1.02]'
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                      <span className="text-xs font-semibold text-slate-800">{slice.label}</span>
                    </div>
                    <span className="text-[10px] font-bold font-mono text-slate-500">{slice.percentage}%</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 pl-4">{slice.count}</div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

