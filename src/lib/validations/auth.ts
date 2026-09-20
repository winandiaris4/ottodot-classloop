import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Nama lengkap minimal 2 karakter').max(100),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.enum(['student', 'parent', 'teacher', 'admin']),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
