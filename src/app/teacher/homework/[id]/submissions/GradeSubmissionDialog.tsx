'use client'

import React, { useActionState, useState } from 'react'
import { gradeSubmissionAction } from '@/lib/actions/teacher'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button, buttonVariants } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, Loader2, Sparkles, User, FileText } from 'lucide-react'

interface GradeSubmissionDialogProps {
  submission: {
    id: string
    content: string | null
    score: number | null
    feedback: string | null
    submitted_at: string
    studentName: string
  }
  homeworkTitle: string
  maxScore: number
}

export function GradeSubmissionDialog({
  submission,
  homeworkTitle,
  maxScore,
}: GradeSubmissionDialogProps) {
  const [open, setOpen] = useState(false)
  const isAlreadyGraded = submission.score !== null

  const [state, formAction, isPending] = useActionState(async (prev: unknown, formData: FormData) => {
    const res = await gradeSubmissionAction(null, formData)
    if (res.success) {
      setOpen(false)
    }
    return res
  }, null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({
          size: 'sm',
          variant: isAlreadyGraded ? 'outline' : 'default',
          className: isAlreadyGraded
            ? 'text-xs'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium',
        })}
      >
        {isAlreadyGraded ? 'Edit Grade & Feedback' : 'Grade Submission'}
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px]">
              {homeworkTitle}
            </Badge>
            {isAlreadyGraded && (
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]">
                Score: {submission.score} / {maxScore}
              </Badge>
            )}
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Student Submission Review
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Review student's answer and assign score with constructive feedback.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Student Info & Submission Details */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                  {submission.studentName.charAt(0)}
                </div>
                <span className="text-xs font-bold text-slate-900">{submission.studentName}</span>
              </div>
              <span className="text-[10px] text-slate-400">
                Submitted on {new Date(submission.submitted_at).toLocaleString()}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200/60">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Student Response / Calculations:
              </div>
              <div className="text-xs text-slate-800 bg-white p-3 rounded-md border border-slate-200 whitespace-pre-wrap font-mono leading-relaxed">
                {submission.content || 'No text submitted.'}
              </div>
            </div>
          </div>

          {/* Grading Form */}
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="submission_id" value={submission.id} />

            {state?.error && (
              <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200 py-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-xs">{state.error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="score" className="text-xs font-semibold">
                  Score (Out of {maxScore} points)
                </Label>
              </div>
              <Input
                id="score"
                name="score"
                type="number"
                defaultValue={submission.score ?? ''}
                placeholder={`0 - ${maxScore}`}
                min={0}
                max={maxScore}
                required
                className="text-sm focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="feedback" className="text-xs font-semibold">
                Teacher Feedback & Guidance
              </Label>
              <Textarea
                id="feedback"
                name="feedback"
                defaultValue={submission.feedback ?? ''}
                placeholder="Highlight what the student did well and explain areas to improve..."
                rows={4}
                required
                className="text-sm focus-visible:ring-indigo-500"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving Grade...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Save & Release Grade
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
