import { z } from 'zod'

export const createClassSchema = z.object({
  name: z.string().min(3, 'Class name must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  max_students: z.coerce.number().int().min(1).max(100).default(20),
})

export type CreateClassInput = z.infer<typeof createClassSchema>
