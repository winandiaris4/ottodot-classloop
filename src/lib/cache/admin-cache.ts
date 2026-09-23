import { unstable_cache } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * Cached Admin Users & Parent-Student Links
 */
export const getCachedAdminUsersData = unstable_cache(
  async () => {
    const supabase = createServiceClient()

    const [
      { data: users = [] },
      { data: links = [] },
      authUsersRes,
    ] = await Promise.all([
      supabase
        .from('user_profiles')
        .select('id, full_name, role, avatar_url, is_active, created_at')
        .order('created_at', { ascending: false }),
      supabase.from('parent_student_links').select(`
        id,
        parent_id,
        student_id,
        student:student_id(id, full_name)
      `),
      supabase.auth.admin.listUsers({ perPage: 1000 }).catch(() => ({ data: { users: [] } })),
    ])

    const authMap = new Map<string, string>()
    if (authUsersRes?.data?.users) {
      authUsersRes.data.users.forEach((u) => {
        if (u.email) authMap.set(u.id, u.email)
      })
    }

    const formattedUsers = (users || []).map((u: any) => ({
      ...u,
      email: authMap.get(u.id) || null,
    }))

    const formattedLinks = (links || []).map((l: any) => ({
      id: l.id,
      parent_id: l.parent_id,
      student_id: l.student_id,
      student: Array.isArray(l.student) ? l.student[0] : l.student,
    }))

    return {
      users: formattedUsers,
      links: formattedLinks,
    }
  },
  ['admin-users-data'],
  { revalidate: 30, tags: ['admin-users', 'user-profiles'] }
)

/**
 * Cached Admin Enrollments, Students, and Classes
 */
export const getCachedAdminEnrollmentsData = unstable_cache(
  async () => {
    const supabase = createServiceClient()

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

    return {
      enrollments: formattedEnrollments,
      students: students || [],
      classes: classes || [],
    }
  },
  ['admin-enrollments-data'],
  { revalidate: 30, tags: ['admin-enrollments', 'classes-data'] }
)

/**
 * Cached Admin Operational Reports
 */
export const getCachedAdminReportsData = unstable_cache(
  async () => {
    const supabase = createServiceClient()

    const [
      { data: classes = [] },
      { data: enrollments = [] },
      { data: homework = [] },
      { data: submissions = [] },
    ] = await Promise.all([
      supabase
        .from('classes')
        .select('id, name, description, max_students, status, created_at, teacher:teacher_id(full_name)')
        .order('name', { ascending: true }),
      supabase.from('enrollments').select('id, class_id, student_id, status'),
      supabase.from('homework').select('id, class_id, title, max_score'),
      supabase
        .from('homework_submissions')
        .select(`
          id,
          score,
          feedback,
          submitted_at,
          graded_at,
          homework_id,
          student:student_id(full_name),
          homework:homework_id(title, class_id, max_score)
        `)
        .order('graded_at', { ascending: false }),
    ])

    return {
      classes: classes || [],
      enrollments: enrollments || [],
      homework: homework || [],
      submissions: submissions || [],
    }
  },
  ['admin-reports-data'],
  { revalidate: 30, tags: ['admin-reports', 'dashboard-stats'] }
)

