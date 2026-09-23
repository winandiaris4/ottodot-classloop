import { z } from "zod"

export const linkParentStudentSchema = z.object({
  parentId: z.string().uuid("Invalid parent ID"),
  studentId: z.string().uuid("Invalid student ID"),
})

export type LinkParentStudentInput = z.infer<typeof linkParentStudentSchema>

export const unlinkParentStudentSchema = z.object({
  linkId: z.string().uuid("Invalid link ID"),
})

export type UnlinkParentStudentInput = z.infer<typeof unlinkParentStudentSchema>

export const updateUserRoleSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  role: z.enum(["admin", "teacher", "student", "parent"], {
    message: "Invalid role selected",
  }),
})

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>

export const enrollStudentSchema = z.object({
  studentId: z.string().uuid("Invalid student ID"),
  classId: z.string().uuid("Invalid class ID"),
  status: z.enum(["active", "completed", "cancelled"]).default("active"),
})

export type EnrollStudentInput = z.infer<typeof enrollStudentSchema>

export const updateEnrollmentStatusSchema = z.object({
  enrollmentId: z.string().uuid("Invalid enrollment ID"),
  status: z.enum(["active", "completed", "cancelled"]),
})

export type UpdateEnrollmentStatusInput = z.infer<typeof updateEnrollmentStatusSchema>

export const createUserSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "teacher", "student", "parent"], {
    message: "Invalid role selected",
  }),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  role: z.enum(["admin", "teacher", "student", "parent"], {
    message: "Invalid role selected",
  }),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export const deleteUserSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
})

export type DeleteUserInput = z.infer<typeof deleteUserSchema>

