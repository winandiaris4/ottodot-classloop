'use server'

import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/resend'
import { revalidatePath } from 'next/cache'

export interface ActionResult {
  success: boolean
  error?: string
  data?: unknown
}

export interface NotificationItem {
  id: string
  user_id: string
  title: string
  body: string | null
  type: string
  is_read: boolean
  metadata: any
  created_at: string
}

import { headers } from 'next/headers'
import { getCurrentUser } from '@/lib/actions/auth'
import { createServiceClient } from '@/lib/supabase/server'

export async function fetchNotificationsAction(): Promise<{
  success: boolean
  notifications: NotificationItem[]
  unreadCount: number
  error?: string
}> {
  const headerList = await headers()
  let userId = headerList.get('x-user-id')

  if (!userId) {
    const user = await getCurrentUser()
    userId = user?.id || null
  }

  if (!userId) {
    return { success: false, notifications: [], unreadCount: 0, error: 'Unauthorized' }
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('notifications')
    .select('id, user_id, title, body, type, is_read, metadata, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    return { success: false, notifications: [], unreadCount: 0, error: error.message }
  }

  const notifications = (data || []) as NotificationItem[]
  const unreadCount = notifications.filter((n) => !n.is_read).length

  return { success: true, notifications, unreadCount }
}

export async function markNotificationAsReadAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const notificationId = formData.get('notificationId') as string
  if (!notificationId) {
    return { success: false, error: 'Missing notification ID' }
  }

  const headerList = await headers()
  let userId = headerList.get('x-user-id')

  if (!userId) {
    const user = await getCurrentUser()
    userId = user?.id || null
  }

  if (!userId) {
    return { success: false, error: 'Unauthorized' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', userId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function markAllNotificationsAsReadAction(): Promise<ActionResult> {
  const headerList = await headers()
  let userId = headerList.get('x-user-id')

  if (!userId) {
    const user = await getCurrentUser()
    userId = user?.id || null
  }

  if (!userId) {
    return { success: false, error: 'Unauthorized' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export interface DispatchNotificationParams {
  userId: string
  title: string
  body: string
  type: 'homework_assigned' | 'homework_submitted' | 'homework_graded' | 'session_reminder' | 'system'
  metadata?: Record<string, any>
  email?: {
    to: string
    subject: string
    html: string
  }
}

export async function dispatchNotification({
  userId,
  title,
  body,
  type,
  metadata = {},
  email,
}: DispatchNotificationParams) {
  const supabase = await createClient()

  // 1. Insert in-app notification
  await supabase.from('notifications').insert({
    user_id: userId,
    title,
    body,
    type,
    metadata,
    is_read: false,
  })

  // 2. If email payload provided, dispatch email
  if (email) {
    await sendEmail({
      to: email.to,
      subject: email.subject,
      html: email.html,
    })
  }
}

