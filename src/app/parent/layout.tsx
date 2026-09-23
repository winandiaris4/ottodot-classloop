import React from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getCurrentUser } from '@/lib/actions/auth'
import { DashboardShell } from '@/components/layouts/DashboardShell'

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerList = await headers()
  let userId = headerList.get('x-user-id')
  let role = headerList.get('x-user-role')
  let userName = headerList.get('x-user-name')
    ? decodeURIComponent(headerList.get('x-user-name')!)
    : ''
  let userEmail = headerList.get('x-user-email') || ''

  if (!userId) {
    const user = await getCurrentUser()
    if (!user) {
      redirect('/login')
    }
    userId = user.id
    role = user.user_metadata?.role || 'parent'
    userName = user.user_metadata?.full_name || 'Parent'
    userEmail = user.email || ''
  }

  if (role !== 'parent' && role !== 'admin') {
    redirect(`/${role || 'student'}/dashboard`)
  }

  return (
    <DashboardShell
      role="parent"
      userName={userName || 'Parent'}
      userEmail={userEmail}
      title="Parent Portal"
    >
      {children}
    </DashboardShell>
  )
}
