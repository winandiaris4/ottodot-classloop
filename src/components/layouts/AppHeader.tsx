'use client'

import React, { useState } from 'react'
import type { UserRole } from '@/types'
import { Menu } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { AppSidebar } from '@/components/layouts/AppSidebar'
import { NotificationBell } from '@/components/layouts/NotificationBell'
import { UserDropdownMenu } from '@/components/layouts/UserDropdownMenu'

interface AppHeaderProps {
  role: UserRole
  userName?: string
  userEmail?: string
  title?: string
}

export function AppHeader({ role, userName, userEmail, title }: AppHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Mobile Drawer Trigger & Title */}
      <div className="flex items-center gap-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'lg:hidden text-slate-600' })}>
            <Menu className="w-5 h-5" />
            <span className="sr-only">Toggle Navigation</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-slate-50 border-r border-slate-200">
            <AppSidebar role={role} userName={userName} userEmail={userEmail} />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="font-medium text-slate-400">ClassLoop</span>
          <span className="text-slate-300">/</span>
          <span className="capitalize font-medium text-slate-500">{role}</span>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-slate-900">{title || 'System Overview'}</span>
        </div>
      </div>

      {/* Right Header Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Role Portal Indicator */}
        <Badge
          variant="outline"
          className="hidden sm:inline-flex text-[11px] font-semibold text-slate-600 bg-slate-50 border-slate-200 px-2.5 py-0.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block" />
          {role.charAt(0).toUpperCase() + role.slice(1)} Console
        </Badge>

        {/* Real-time In-App Notification Bell */}
        <NotificationBell />

        {/* Consolidated Enterprise User Dropdown Menu */}
        <div className="pl-1 sm:pl-2 border-l border-slate-200/80">
          <UserDropdownMenu role={role} userName={userName} userEmail={userEmail} />
        </div>
      </div>
    </header>
  )
}


