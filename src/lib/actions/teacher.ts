'use server'

import { createClient } from '@/lib/supabase/server'
import { createClassSchema } from '@/lib/validations/class'
import { createHomeworkSchema, gradeSubmissionSchema } from '@/lib/validations/homework'
import { dispatchNotification } from '@/lib/actions/notification'
import { renderHomeworkAssignedEmail, renderHomeworkGradedEmail } from '@/lib/email/templates'
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

  // 1. Insert homework
  const { data: homework, error } = await supabase
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
    .select('*, class:class_id(name)')
    .single()

  if (error || !homework) {
    return { success: false, error: error?.message || 'Failed to create homework' }
  }

  const className = (homework.class as { name?: string } | null)?.name || 'STEM Course'

  // 2. Fetch enrolled active students for notifications
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('student_id, student:student_id(id, full_name)')
    .eq('class_id', validation.data.class_id)
    .eq('status', 'active')

  if (enrollments && enrollments.length > 0) {
    for (const enr of enrollments) {
      const studentObj = Array.isArray(enr.student) ? enr.student[0] : enr.student
      const studentName = studentObj?.full_name || 'Student'

      // Notify Student
      await dispatchNotification({
        userId: enr.student_id,
        title: `New Assignment: ${validation.data.title}`,
        body: `A new task has been assigned in ${className}. Max Score: ${validation.data.max_score} pts.`,
        type: 'homework_assigned',
        metadata: { homeworkId: homework.id, classId: validation.data.class_id },
        email: {
          to: 'student@demo.com', // Demo/live recipient
          subject: `[ClassLoop] New Homework Assigned: ${validation.data.title}`,
          html: renderHomeworkAssignedEmail({
            studentName,
            homeworkTitle: validation.data.title,
            className,
            dueDate: validation.data.due_at,
            maxScore: validation.data.max_score,
          }),
        },
      })

      // Find and Notify linked Parent(s)
      const { data: parentLinks } = await supabase
        .from('parent_student_links')
        .select('parent_id')
        .eq('student_id', enr.student_id)

      if (parentLinks && parentLinks.length > 0) {
        for (const p of parentLinks) {
          await dispatchNotification({
            userId: p.parent_id,
            title: `New Assignment for ${studentName}`,
            body: `${studentName} was assigned "${validation.data.title}" in ${className}.`,
            type: 'homework_assigned',
            metadata: { homeworkId: homework.id, studentId: enr.student_id },
          })
        }
      }
    }
  }

  revalidatePath('/teacher/homework')
  revalidatePath('/teacher/dashboard')
  revalidatePath(`/teacher/classes/${validation.data.class_id}`)
  revalidatePath('/student/homework')
  revalidatePath('/student/dashboard')
  revalidatePath('/parent/dashboard')

  return { success: true, data: homework }
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
    .select('*, homework:homework_id (id, title, class_id, max_score, class:class_id(name)), student:student_id(full_name)')
    .single()

  if (updateError || !updatedSub) {
    return { success: false, error: updateError?.message || 'Failed to update grade' }
  }

  const studentId = updatedSub.student_id
  const studentObj = Array.isArray(updatedSub.student) ? updatedSub.student[0] : updatedSub.student
  const studentName = studentObj?.full_name || 'Student'

  const hwObj = Array.isArray(updatedSub.homework) ? updatedSub.homework[0] : updatedSub.homework
  const homeworkTitle = hwObj?.title || 'Homework'
  const maxScore = hwObj?.max_score || 100
  const classObj = Array.isArray(hwObj?.class) ? hwObj?.class[0] : hwObj?.class
  const className = classObj?.name || 'Class Session'

  // 2. Notify Student with In-App & Email
  await dispatchNotification({
    userId: studentId,
    title: `Grade Released: ${homeworkTitle}`,
    body: `Your teacher graded your homework with ${validation.data.score}/${maxScore} points.`,
    type: 'homework_graded',
    metadata: { submissionId: updatedSub.id, homeworkId: updatedSub.homework_id },
    email: {
      to: 'student@demo.com',
      subject: `[ClassLoop] Homework Graded: ${homeworkTitle} (${validation.data.score}/${maxScore})`,
      html: renderHomeworkGradedEmail({
        studentName,
        homeworkTitle,
        className,
        score: validation.data.score,
        maxScore,
        feedback: validation.data.feedback,
      }),
    },
  })

  // 3. Find and Notify linked Parent(s)
  const { data: parentLinks } = await supabase
    .from('parent_student_links')
    .select('parent_id')
    .eq('student_id', studentId)

  if (parentLinks && parentLinks.length > 0) {
    for (const link of parentLinks) {
      await dispatchNotification({
        userId: link.parent_id,
        title: `Grade Published for ${studentName}`,
        body: `${studentName} received ${validation.data.score}/${maxScore} points on "${homeworkTitle}".`,
        type: 'homework_graded',
        metadata: { submissionId: updatedSub.id, studentId },
      })
    }
  }

  revalidatePath(`/teacher/homework/${updatedSub.homework_id}/submissions`)
  revalidatePath('/teacher/dashboard')
  revalidatePath('/teacher/homework')
  revalidatePath('/student/homework')
  revalidatePath(`/student/homework/${updatedSub.homework_id}`)
  revalidatePath('/student/dashboard')
  revalidatePath('/parent/dashboard')
  revalidatePath('/parent/children')

  return { success: true, data: updatedSub }
}
