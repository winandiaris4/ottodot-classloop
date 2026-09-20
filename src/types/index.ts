export type UserRole = 'student' | 'parent' | 'teacher' | 'admin'

export type HomeworkStatus = 'draft' | 'published'

export type SubmissionStatus = 'pending' | 'submitted' | 'graded' | 'overdue'

export type EnrollmentStatus = 'active' | 'cancelled' | 'expired'

export type ClassStatus = 'active' | 'archived'

export type NotificationType =
  | 'homework_new'
  | 'homework_deadline'
  | 'grade_released'
  | 'class_reminder'

export interface UserProfile {
  id: string
  full_name: string
  role: UserRole
  avatar_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  name: string
  description: string | null
  teacher_id: string
  max_students: number
  status: ClassStatus
  created_at: string
  updated_at: string
}

export interface Homework {
  id: string
  class_id: string
  teacher_id: string
  title: string
  description: string | null
  due_at: string
  max_score: number
  status: HomeworkStatus
  created_at: string
  updated_at: string
}

export interface HomeworkSubmission {
  id: string
  homework_id: string
  student_id: string
  content: string | null
  attachment_url: string | null
  score: number | null
  feedback: string | null
  graded_at: string | null
  graded_by: string | null
  submitted_at: string
  updated_at: string
}

export interface Enrollment {
  id: string
  student_id: string
  class_id: string
  plan_id: string | null
  status: EnrollmentStatus
  stripe_session_id: string | null
  stripe_payment_id: string | null
  enrolled_at: string
  expires_at: string | null
}

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string | null
  type: NotificationType
  is_read: boolean
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface Plan {
  id: string
  name: string
  description: string | null
  price_cents: number
  currency: string
  duration_days: number
  class_count: number
  stripe_price_id: string | null
  is_active: boolean
  created_at: string
}
