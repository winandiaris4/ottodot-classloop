'use server'

import { createClient } from '@/lib/supabase/server'
import { submitHomeworkSchema } from '@/lib/validations/submission'
import { revalidatePath } from 'next/cache'

export interface ActionResult {
  success: boolean
  error?: string
  data?: unknown
}

export async function submitHomeworkAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    homework_id: formData.get('homework_id'),
    content: formData.get('content'),
    attachment_url: formData.get('attachment_url') || undefined,
  }

  const validation = submitHomeworkSchema.safeParse(raw)
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid submission',
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  // 1. Get student profile name for teacher notification
  const { data: studentProfile } = await supabase
    .from('user_profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const studentName = studentProfile?.full_name || 'A student'

  // 2. Fetch homework details (to find teacher_id and title)
  const { data: homework } = await supabase
    .from('homework')
    .select('id, title, teacher_id')
    .eq('id', validation.data.homework_id)
    .single()

  if (!homework) {
    return { success: false, error: 'Homework not found' }
  }

  // 3. Upsert submission
  const { data: submission, error: submitError } = await supabase
    .from('homework_submissions')
    .upsert(
      {
        homework_id: validation.data.homework_id,
        student_id: user.id,
        content: validation.data.content,
        attachment_url: validation.data.attachment_url || null,
        submitted_at: new Date().toISOString(),
      },
      { onConflict: 'homework_id,student_id' }
    )
    .select()
    .single()

  if (submitError) {
    return { success: false, error: submitError.message }
  }

  // 4. Notify Teacher
  await supabase.from('notifications').insert({
    user_id: homework.teacher_id,
    title: `New Homework Submission`,
    body: `${studentName} submitted "${homework.title}" for grading.`,
    type: 'homework_new',
    is_read: false,
  })

  revalidatePath('/student/homework')
  revalidatePath(`/student/homework/${validation.data.homework_id}`)
  revalidatePath('/student/dashboard')
  revalidatePath(`/teacher/homework/${validation.data.homework_id}/submissions`)

  return { success: true, data: submission }
}
