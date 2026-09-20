'use client'

import React, { useActionState, useState } from 'react'
import { createHomeworkAction } from '@/lib/actions/teacher'
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
import { Plus, AlertCircle, Loader2 } from 'lucide-react'

interface ClassOption {
  id: string
  name: string
}

export function CreateHomeworkDialog({ classes }: { classes: ClassOption[] }) {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(async (prev: unknown, formData: FormData) => {
    const res = await createHomeworkAction(null, formData)
    if (res.success) {
      setOpen(false)
    }
    return res
  }, null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ size: 'sm', className: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs' })}>
        <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Homework
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">Create Assignment</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Publish a new science or math homework assignment for your classroom.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-2">
          {state?.error && (
            <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200 py-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-xs">{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="class_id" className="text-xs font-semibold">Target Class</Label>
            <select
              id="class_id"
              name="class_id"
              required
              className="w-full text-xs rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a classroom...</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold">Homework Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Gravity & Friction Experiment in Space Station"
              required
              className="text-sm focus-visible:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold">Instructions & Task Prompt</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Detailed instructions for calculations, observations, or sandbox tests..."
              rows={4}
              required
              className="text-sm focus-visible:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="due_at" className="text-xs font-semibold">Due Date & Time</Label>
              <Input
                id="due_at"
                name="due_at"
                type="datetime-local"
                required
                className="text-xs focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="max_score" className="text-xs font-semibold">Max Score Points</Label>
              <Input
                id="max_score"
                name="max_score"
                type="number"
                defaultValue={100}
                min={1}
                max={1000}
                required
                className="text-xs focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-xs font-semibold">Publication Status</Label>
            <select
              id="status"
              name="status"
              className="w-full text-xs rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="published">Published (Visible to students immediately)</option>
              <option value="draft">Draft (Saved privately)</option>
            </select>
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
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving...
                </>
              ) : (
                'Publish Homework'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
