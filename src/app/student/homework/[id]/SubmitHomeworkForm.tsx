'use client'

import React, { useActionState } from 'react'
import { submitHomeworkAction } from '@/lib/actions/student'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Send, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'

interface SubmitHomeworkFormProps {
  homeworkId: string
  existingContent?: string | null
  existingAttachmentUrl?: string | null
  isGraded: boolean
}

export function SubmitHomeworkForm({
  homeworkId,
  existingContent,
  existingAttachmentUrl,
  isGraded,
}: SubmitHomeworkFormProps) {
  const [state, formAction, isPending] = useActionState(submitHomeworkAction, null)

  if (isGraded) {
    return (
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
        <p className="font-semibold text-slate-700">Submission Locked</p>
        <p className="mt-0.5">This homework has already been graded by your instructor and cannot be resubmitted.</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="homework_id" value={homeworkId} />

      {state?.error && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200 py-2.5">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-xs">{state.error}</AlertDescription>
        </Alert>
      )}

      {state?.success && (
        <Alert className="bg-emerald-50 text-emerald-800 border-emerald-200 py-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-xs">
            Homework submitted successfully! Your teacher has been notified for review.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="content" className="text-xs font-semibold text-slate-900">
          Your Response, Calculations & Science Observations
        </Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={existingContent || ''}
          placeholder="Write your explanation, formulas (e.g. v = sqrt(2gh)), data tables, and conclusions here..."
          rows={7}
          required
          className="text-sm font-mono focus-visible:ring-indigo-500 bg-white"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="attachment_url" className="text-xs font-semibold text-slate-900">
          Optional Attachment / Project Link (URL)
        </Label>
        <Input
          id="attachment_url"
          name="attachment_url"
          type="url"
          defaultValue={existingAttachmentUrl || ''}
          placeholder="https://roblox.com/... or cloud document link"
          className="text-xs focus-visible:ring-indigo-500 bg-white"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs"
      >
        {isPending ? (
          <>
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Submitting Mission...
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5 mr-1.5" />
            {existingContent ? 'Update Submission' : 'Submit Homework'}
          </>
        )}
      </Button>
    </form>
  )
}

