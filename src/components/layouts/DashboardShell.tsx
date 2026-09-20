import React from 'react'
import { AppSidebar } from '@/components/layouts/AppSidebar'
import { AppHeader } from '@/components/layouts/AppHeader'
import type { UserRole } from '@/types'

interface DashboardShellProps {
  role: UserRole
  userName?: string
  userEmail?: string
  title?: string
  children: React.ReactNode
}

export function DashboardShell({
  role,
  userName,
  userEmail,
  title,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar (Fixed Left) */}
      <div className="hidden lg:block shrink-0">
        <AppSidebar role={role} userName={userName} userEmail={userEmail} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          role={role}
          userName={userName}
          userEmail={userEmail}
          title={title}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
