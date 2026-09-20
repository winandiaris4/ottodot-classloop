'use server'

import { createClient } from '@/lib/supabase/server'
import {
  linkParentStudentSchema,
  unlinkParentStudentSchema,
  updateUserRoleSchema,
  enrollStudentSchema,
  updateEnrollmentStatusSchema,
} from '@/lib/validations/admin'
import { revalidatePath } from 'next/cache'

export interface ActionResult {
  success: boolean
  error?: string
  data?: unknown
}

async function verifyAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { supabase, user: null, error: 'Unauthorized: Session required' }
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return { supabase, user: null, error: 'Forbidden: Admin access required' }
  }

  return { supabase, user, error: null }
}

export async function linkParentStudentAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    parentId: formData.get('parentId'),
    studentId: formData.get('studentId'),
  }

  const validation = linkParentStudentSchema.safeParse(raw)
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid input data',
    }
  }

  const { supabase, error: authError } = await verifyAdmin()
  if (authError || !supabase) {
    return { success: false, error: authError || 'Unauthorized' }
  }

  // Check if link already exists
  const { data: existingLink } = await supabase
    .from('parent_student_links')
    .select('id')
    .eq('parent_id', validation.data.parentId)
    .eq('student_id', validation.data.studentId)
    .maybeSingle()

  if (existingLink) {
    return { success: false, error: 'This parent is already linked to this student.' }
  }

  const { data, error } = await supabase
    .from('parent_student_links')
    .insert({
      parent_id: validation.data.parentId,
      student_id: validation.data.studentId,
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/users')
  revalidatePath('/admin/dashboard')
  revalidatePath('/parent/dashboard')
  revalidatePath('/parent/children')

  return { success: true, data }
}

export async function unlinkParentStudentAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    linkId: formData.get('linkId'),
  }

  const validation = unlinkParentStudentSchema.safeParse(raw)
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid link ID',
    }
  }

  const { supabase, error: authError } = await verifyAdmin()
  if (authError || !supabase) {
    return { success: false, error: authError || 'Unauthorized' }
  }

  const { error } = await supabase
    .from('parent_student_links')
    .delete()
    .eq('id', validation.data.linkId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/users')
  revalidatePath('/admin/dashboard')
  revalidatePath('/parent/dashboard')
  revalidatePath('/parent/children')

  return { success: true }
}

export async function updateUserRoleAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    userId: formData.get('userId'),
    role: formData.get('role'),
  }

  const validation = updateUserRoleSchema.safeParse(raw)
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid role update',
    }
  }

  const { supabase, error: authError } = await verifyAdmin()
  if (authError || !supabase) {
    return { success: false, error: authError || 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .update({ role: validation.data.role })
    .eq('id', validation.data.userId)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/users')
  revalidatePath('/admin/dashboard')

  return { success: true, data }
}

export async function enrollStudentAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    studentId: formData.get('studentId'),
    classId: formData.get('classId'),
    status: formData.get('status') || 'active',
  }

  const validation = enrollStudentSchema.safeParse(raw)
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid enrollment data',
    }
  }

  const { supabase, error: authError } = await verifyAdmin()
  if (authError || !supabase) {
    return { success: false, error: authError || 'Unauthorized' }
  }

  // Check if student is already enrolled in this class
  const { data: existingEnrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('student_id', validation.data.studentId)
    .eq('class_id', validation.data.classId)
    .maybeSingle()

  if (existingEnrollment) {
    return { success: false, error: 'Student is already enrolled in this class.' }
  }

  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      student_id: validation.data.studentId,
      class_id: validation.data.classId,
      status: validation.data.status,
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/enrollments')
  revalidatePath('/admin/dashboard')
  revalidatePath('/student/dashboard')
  revalidatePath('/parent/dashboard')

  return { success: true, data }
}

export async function updateEnrollmentStatusAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    enrollmentId: formData.get('enrollmentId'),
    status: formData.get('status'),
  }

  const validation = updateEnrollmentStatusSchema.safeParse(raw)
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid status data',
    }
  }

  const { supabase, error: authError } = await verifyAdmin()
  if (authError || !supabase) {
    return { success: false, error: authError || 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('enrollments')
    .update({ status: validation.data.status })
    .eq('id', validation.data.enrollmentId)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/enrollments')
  revalidatePath('/admin/dashboard')

  return { success: true, data }
}
