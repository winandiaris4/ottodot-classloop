import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { EnrollmentsTable } from './EnrollmentsTable'

export default async function AdminEnrollmentsPage() {
  const supabase = await createClient()

  // Fetch enrollments, students, and active classes in parallel (1 network roundtrip)
  const [
    { data: enrollments = [] },
    { data: students = [] },
    { data: classes = [] },
  ] = await Promise.all([
    supabase
      .from('enrollments')
      .select(`
        id,
        status,
        enrolled_at,
        student_id,
        class_id,
        student:student_id(id, full_name),
        class:class_id(id, name, max_students, teacher:teacher_id(full_name))
      `)
      .order('enrolled_at', { ascending: false }),
    supabase
      .from('user_profiles')
      .select('id, full_name')
      .eq('role', 'student')
      .order('full_name', { ascending: true }),
    supabase
      .from('classes')
      .select('id, name, max_students')
      .eq('status', 'active')
      .order('name', { ascending: true }),
  ])

  const formattedEnrollments = (enrollments || []).map((e: any) => ({
    id: e.id,
    status: e.status,
    enrolled_at: e.enrolled_at,
    student_id: e.student_id,
    class_id: e.class_id,
    student: Array.isArray(e.student) ? e.student[0] : e.student,
    class: Array.isArray(e.class)
      ? {
          ...e.class[0],
          teacher: Array.isArray(e.class[0]?.teacher) ? e.class[0]?.teacher[0] : e.class[0]?.teacher,
        }
      : {
          ...e.class,
          teacher: Array.isArray(e.class?.teacher) ? e.class?.teacher[0] : e.class?.teacher,
        },
  }))

  return (
    <div className="space-y-6">
      <EnrollmentsTable
        enrollments={formattedEnrollments}
        students={students || []}
        classes={classes || []}
      />
    </div>
  )
}

