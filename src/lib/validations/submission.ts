import { z } from 'zod'

export const submitHomeworkSchema = z.object({
  homework_id: z.string().uuid('Invalid homework ID'),
  content: z.string().min(5, 'Your answer or calculations must be at least 5 characters long'),
  attachment_url: z.string().url('Invalid URL format').optional().or(z.literal('')),
})

export type SubmitHomeworkInput = z.infer<typeof submitHomeworkSchema>
