import { z } from 'zod'

export const createHomeworkSchema = z.object({
  class_id: z.string().uuid('Please select a valid class'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  due_at: z.string().min(1, 'Please specify a due date'),
  max_score: z.coerce.number().int().min(1).max(1000).default(100),
  status: z.enum(['draft', 'published']).default('published'),
})

export const gradeSubmissionSchema = z.object({
  submission_id: z.string().uuid('Invalid submission ID'),
  score: z.coerce.number().int().min(0, 'Score cannot be negative').max(1000, 'Score exceeds max allowed'),
  feedback: z.string().min(2, 'Feedback must be at least 2 characters'),
})

export type CreateHomeworkInput = z.infer<typeof createHomeworkSchema>
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>
