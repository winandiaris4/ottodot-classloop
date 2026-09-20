'use client'

import React, { useState } from 'react'
import type { UserRole } from '@/types'
import { Menu, LogOut } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { AppSidebar } from '@/components/layouts/AppSidebar'
import { logoutAction } from '@/lib/actions/auth'

interface AppHeaderProps {
  role: UserRole
  userName?: string
  userEmail?: string
  title?: string
}

export function AppHeader({ role, userName, userEmail, title }: AppHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Drawer Trigger & Title */}
      <div className="flex items-center gap-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'lg:hidden text-slate-600' })}>
            <Menu className="w-5 h-5" />
            <span className="sr-only">Toggle Navigation</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-slate-900 border-r border-slate-800">
            <AppSidebar role={role} userName={userName} userEmail={userEmail} />
          </SheetContent>
        </Sheet>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            {title || 'Dashboard'}
          </h1>
        </div>
      </div>

      {/* Right Header Controls */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <Badge variant="outline" className="text-xs capitalize font-medium text-slate-600 bg-slate-50">
            {role} Portal
          </Badge>
        </div>

        {/* User avatar chip & logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-none">{userName || 'Pengguna'}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{userEmail || ''}</p>
          </div>

          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-xs text-slate-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-3.5 h-3.5 mr-1 text-slate-400 group-hover:text-red-600" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}

