'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { UserRole } from '@/types'
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Users,
  School,
  ClipboardList,
  UserCheck,
  CreditCard,
  BarChart3,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string
}

export const ROLE_NAV_ITEMS: Record<UserRole, NavItem[]> = {
  student: [
    { title: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { title: 'My Homework', href: '/student/homework', icon: BookOpen },
    { title: 'Class Schedule', href: '/student/schedule', icon: Calendar },
  ],
  teacher: [
    { title: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
    { title: 'Class Rosters', href: '/teacher/classes', icon: School },
    { title: 'Homework & Grading', href: '/teacher/homework', icon: ClipboardList },
  ],
  parent: [
    { title: 'Dashboard', href: '/parent/dashboard', icon: LayoutDashboard },
    { title: 'Child Progress', href: '/parent/children', icon: Users },
    { title: 'Class Schedule', href: '/parent/schedule', icon: Calendar },
  ],
  admin: [
    { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'User Management', href: '/admin/users', icon: UserCheck },
    { title: 'Enrollments', href: '/admin/enrollments', icon: CreditCard },
    { title: 'Operational Reports', href: '/admin/reports', icon: BarChart3 },
  ],
}

const ROLE_BADGE_STYLE: Record<UserRole, { label: string; className: string }> = {
  student: { label: 'Student', className: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' },
  teacher: { label: 'Teacher', className: 'bg-blue-50 text-blue-700 border-blue-200/80' },
  parent: { label: 'Parent', className: 'bg-amber-50 text-amber-700 border-amber-200/80' },
  admin: { label: 'Admin', className: 'bg-purple-50 text-purple-700 border-purple-200/80' },
}

interface AppSidebarProps {
  role: UserRole
  userName?: string
  userEmail?: string
}

export function AppSidebar({ role, userName, userEmail }: AppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const navItems = ROLE_NAV_ITEMS[role] || []
  const roleBadge = ROLE_BADGE_STYLE[role]

  const handlePrefetch = (href: string) => {
    // Only prefetch if we're not already on this page
    if (pathname !== href) {
      router.prefetch(href)
    }
  }

  return (
    <aside className="w-64 bg-slate-50/90 backdrop-blur-md text-slate-800 h-screen flex flex-col justify-between border-r border-slate-200/90 shrink-0 select-none overflow-y-auto">
      {/* Brand & Role Header */}
      <div>
        <div className="p-5 border-b border-slate-200/80">
          <Link
            href={`/${role}/dashboard`}
            prefetch={false}
            onMouseEnter={() => handlePrefetch(`/${role}/dashboard`)}
            onFocus={() => handlePrefetch(`/${role}/dashboard`)}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-900 tracking-tight">ClassLoop</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 font-semibold ${roleBadge.className}`}>
                  {roleBadge.label}
                </Badge>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Main Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                onMouseEnter={() => handlePrefetch(item.href)}
                onFocus={() => handlePrefetch(item.href)}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50/90 text-indigo-900 font-semibold shadow-2xs border border-indigo-200/80'
                    : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isActive && (
                    <span className="absolute left-1 w-1 h-4 rounded-full bg-indigo-600" />
                  )}
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="truncate">{item.title}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold font-mono ${
                      isActive ? 'bg-indigo-200/80 text-indigo-800' : 'bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Clean Enterprise Workspace Footer */}
      <div className="p-3 border-t border-slate-200/80 mt-auto">
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs text-[11px] text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-800 text-xs">ClassLoop System</span>
          </div>
          <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">v1.2</span>
        </div>
      </div>
    </aside>
  )
}
