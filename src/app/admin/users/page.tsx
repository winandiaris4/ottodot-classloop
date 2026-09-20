import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { UsersListTable } from './UsersListTable'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  // Fetch all user profiles and parent-student links in parallel (1 network roundtrip)
  const [
    { data: users = [] },
    { data: links = [] },
  ] = await Promise.all([
    supabase.from('user_profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('parent_student_links').select(`
      id,
      parent_id,
      student_id,
      student:student_id(id, full_name)
    `),
  ])

  const formattedLinks = (links || []).map((l: any) => ({
    id: l.id,
    parent_id: l.parent_id,
    student_id: l.student_id,
    student: Array.isArray(l.student) ? l.student[0] : l.student,
  }))

  return (
    <div className="space-y-6">
      <UsersListTable users={(users || []) as any} links={formattedLinks} />
    </div>
  )
}
