'use server'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, registerSchema } from '@/lib/validations/auth'
import type { UserRole } from '@/types'
import { redirect } from 'next/navigation'

export interface AuthActionResult {
  success: boolean
  error?: string
  redirectUrl?: string
}

const ROLE_DASHBOARDS: Record<UserRole, string> = {
  student: '/student/dashboard',
  parent: '/parent/dashboard',
  teacher: '/teacher/dashboard',
  admin: '/admin/dashboard',
}

export async function loginAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const validation = loginSchema.safeParse(rawData)
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Input tidak valid',
    }
  }

  const { email, password } = validation.data
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return {
      success: false,
      error: error?.message || 'Email atau password salah',
    }
  }

  // Ambil role profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, is_active')
    .eq('id', data.user.id)
    .single()

  if (profile && !profile.is_active) {
    await supabase.auth.signOut()
    return {
      success: false,
      error: 'Akun Anda telah dinonaktifkan oleh administrator.',
    }
  }

  const role = (profile?.role as UserRole) || 'student'
  const destination = ROLE_DASHBOARDS[role] || '/student/dashboard'

  redirect(destination)
}

export async function registerAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
  }

  const validation = registerSchema.safeParse(rawData)
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Input tidak valid',
    }
  }

  const { full_name, email, password, role } = validation.data
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        role,
      },
    },
  })

  if (error || !data.user) {
    return {
      success: false,
      error: error?.message || 'Gagal mendaftarkan akun. Silakan coba lagi.',
    }
  }

  // Jika session langsung terbentuk:
  if (data.session) {
    const destination = ROLE_DASHBOARDS[role]
    redirect(destination)
  }

  return {
    success: true,
    error: undefined,
  }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

export const getCurrentUserProfile = cache(async () => {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
})

