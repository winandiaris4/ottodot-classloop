import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layouts/DashboardShell'

export default async function StudentLayout({
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

  if (profile?.role !== 'student' && profile?.role !== 'admin') {
    redirect(`/${profile?.role || 'student'}/dashboard`)
  }

  return (
    <DashboardShell
      role="student"
      userName={profile?.full_name || 'Murid'}
      userEmail={user.email}
      title="Student Portal"
    >
      {children}
    </DashboardShell>
  )
}
