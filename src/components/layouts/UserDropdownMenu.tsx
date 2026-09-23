'use client'

import React from 'react'
import type { UserRole } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  LogOut,
  ChevronDown,
  Shield,
  School,
  GraduationCap,
  HeartHandshake,
  User,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { logoutAction } from '@/lib/actions/auth'

interface UserDropdownMenuProps {
  role: UserRole
  userName?: string
  userEmail?: string
}

const ROLE_CONFIG: Record<
  UserRole,
  { label: string; icon: React.ElementType; badgeClass: string; avatarBg: string }
> = {
  admin: {
    label: 'Administrator',
    icon: Shield,
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    avatarBg: 'bg-rose-100 text-rose-700 border-rose-200',
  },
  teacher: {
    label: 'Teacher',
    icon: School,
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    avatarBg: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  student: {
    label: 'Student',
    icon: GraduationCap,
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    avatarBg: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
  parent: {
    label: 'Parent',
    icon: HeartHandshake,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    avatarBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
}

export function UserDropdownMenu({ role, userName, userEmail }: UserDropdownMenuProps) {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.student
  const RoleIcon = config.icon
  const initials = userName
    ? userName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 p-1.5 pl-2 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer">
        <div
          className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shadow-2xs ${config.avatarBg}`}
        >
          {initials}
        </div>
        <div className="hidden md:flex flex-col text-left pr-1">
          <span className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[140px]">
            {userName || 'User Account'}
          </span>
          <span className="text-[10px] font-medium text-slate-500 leading-tight">
            {config.label}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block mr-0.5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-1.5 shadow-lg border-slate-200">
        {/* User Identity Header */}
        <div className="px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-100 mb-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-900 truncate">
              {userName || 'User'}
            </span>
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4.5 font-semibold ${config.badgeClass}`}>
              <RoleIcon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
          </div>
          <p className="text-[11px] text-slate-500 truncate font-mono">{userEmail || 'No email attached'}</p>
        </div>

        {/* Workspace Info */}
        <div className="px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            ClassLoop System Active
          </span>
          <span className="font-mono">v1.2</span>
        </div>

        <DropdownMenuSeparator className="my-1" />

        {/* Logout Action */}
        <form action={logoutAction} className="w-full">
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

