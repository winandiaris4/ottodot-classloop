import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layouts/DashboardShell'

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'parent' && profile?.role !== 'admin') {
    redirect(`/${profile?.role || 'student'}/dashboard`)
  }

  return (
    <DashboardShell
      role="parent"
      userName={profile?.full_name || 'Orang Tua'}
      userEmail={user.email}
      title="Parent Portal"
    >
      {children}
    </DashboardShell>
  )
}
