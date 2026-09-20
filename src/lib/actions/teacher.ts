'use server'

import { createClient } from '@/lib/supabase/server'
import { createClassSchema } from '@/lib/validations/class'
import { createHomeworkSchema, gradeSubmissionSchema } from '@/lib/validations/homework'
import { revalidatePath } from 'next/cache'

export interface ActionResult {
  success: boolean
  error?: string
  data?: unknown
}

export async function createClassAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name: formData.get('name'),
    description: formData.get('description'),
    max_students: formData.get('max_students'),
  }

  const validation = createClassSchema.safeParse(raw)
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid class inputs',
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('classes')
    .insert({
      name: validation.data.name,
      description: validation.data.description || null,
      max_students: validation.data.max_students,
      teacher_id: user.id,
      status: 'active',
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/teacher/classes')
  revalidatePath('/teacher/dashboard')

  return { success: true, data }
}

export async function createHomeworkAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    class_id: formData.get('class_id'),
    title: formData.get('title'),
    description: formData.get('description'),
    due_at: formData.get('due_at'),
    max_score: formData.get('max_score'),
    status: formData.get('status') || 'published',
  }

  const validation = createHomeworkSchema.safeParse(raw)
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid homework inputs',
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('homework')
    .insert({
      class_id: validation.data.class_id,
      title: validation.data.title,
      description: validation.data.description,
      due_at: new Date(validation.data.due_at).toISOString(),
      max_score: validation.data.max_score,
      status: validation.data.status,
      teacher_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/teacher/homework')
  revalidatePath('/teacher/dashboard')
  revalidatePath(`/teacher/classes/${validation.data.class_id}`)

  return { success: true, data }
}

export async function gradeSubmissionAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    submission_id: formData.get('submission_id'),
    score: formData.get('score'),
    feedback: formData.get('feedback'),
  }

  const validation = gradeSubmissionSchema.safeParse(raw)
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid grading inputs',
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  // 1. Update the submission score and feedback
  const { data: updatedSub, error: updateError } = await supabase
    .from('homework_submissions')
    .update({
      score: validation.data.score,
      feedback: validation.data.feedback,
      graded_at: new Date().toISOString(),
      graded_by: user.id,
    })
    .eq('id', validation.data.submission_id)
    .select('*, homework:homework_id (id, title, class_id)')
    .single()

  if (updateError || !updatedSub) {
    return { success: false, error: updateError?.message || 'Failed to update grade' }
  }

  const studentId = updatedSub.student_id
  const homeworkTitle = (updatedSub.homework as { title?: string } | null)?.title || 'Homework'

  // 2. Notify Student
  await supabase.from('notifications').insert({
    user_id: studentId,
    title: `Grade Released: ${homeworkTitle}`,
    body: `Your teacher graded your homework with ${validation.data.score} points and left feedback.`,
    type: 'grade_released',
    is_read: false,
  })

  // 3. Find and Notify linked Parent(s)
  const { data: parentLinks } = await supabase
    .from('parent_student_links')
    .select('parent_id')
    .eq('student_id', studentId)

  if (parentLinks && parentLinks.length > 0) {
    const parentNotifications = parentLinks.map((link) => ({
      user_id: link.parent_id,
      title: `New Grade Published: ${homeworkTitle}`,
      body: `Your child received a score of ${validation.data.score} with teacher feedback.`,
      type: 'grade_released',
      is_read: false,
    }))

    await supabase.from('notifications').insert(parentNotifications)
  }

  revalidatePath(`/teacher/homework/${updatedSub.homework_id}/submissions`)
  revalidatePath('/teacher/dashboard')
  revalidatePath('/teacher/homework')

  return { success: true, data: updatedSub }
}

