'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  LogOut,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { logoutAction } from '@/lib/actions/auth'

export interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string
}

export const ROLE_NAV_ITEMS: Record<UserRole, NavItem[]> = {
  student: [
    { title: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { title: 'Homework Saya', href: '/student/homework', icon: BookOpen },
    { title: 'Jadwal Kelas', href: '/student/schedule', icon: Calendar },
  ],
  teacher: [
    { title: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
    { title: 'Kelola Kelas', href: '/teacher/classes', icon: School },
    { title: 'Homework & Grading', href: '/teacher/homework', icon: ClipboardList },
  ],
  parent: [
    { title: 'Dashboard', href: '/parent/dashboard', icon: LayoutDashboard },
    { title: 'Progress Anak', href: '/parent/children', icon: Users },
    { title: 'Jadwal Kelas', href: '/parent/schedule', icon: Calendar },
  ],
  admin: [
    { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Manajemen User', href: '/admin/users', icon: UserCheck },
    { title: 'Enrollments', href: '/admin/enrollments', icon: CreditCard },
    { title: 'Laporan Operasional', href: '/admin/reports', icon: BarChart3 },
  ],
}

const ROLE_BADGE_STYLE: Record<UserRole, { label: string; className: string }> = {
  student: { label: 'Student', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  teacher: { label: 'Teacher', className: 'bg-blue-100 text-blue-800 border-blue-300' },
  parent: { label: 'Parent', className: 'bg-amber-100 text-amber-800 border-amber-300' },
  admin: { label: 'Admin', className: 'bg-rose-100 text-rose-800 border-rose-300' },
}

interface AppSidebarProps {
  role: UserRole
  userName?: string
  userEmail?: string
}

export function AppSidebar({ role, userName, userEmail }: AppSidebarProps) {
  const pathname = usePathname()
  const navItems = ROLE_NAV_ITEMS[role] || []
  const roleBadge = ROLE_BADGE_STYLE[role]

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen flex flex-col justify-between border-r border-slate-800 shrink-0">
      {/* Brand & Role Header */}
      <div>
        <div className="p-6 border-b border-slate-800">
          <Link href={`/${role}/dashboard`} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">ClassLoop</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${roleBadge.className}`}>
                  {roleBadge.label}
                </Badge>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu Utama
          </div>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/40 text-indigo-200">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User Footer & Logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 mb-2">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-slate-100 truncate">{userName || 'Pengguna'}</p>
            <p className="text-[10px] text-slate-400 truncate">{userEmail || ''}</p>
          </div>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Keluar (Logout)</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
