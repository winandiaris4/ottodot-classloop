'use client'

import React, { useActionState, useState } from 'react'
import { createClassAction } from '@/lib/actions/teacher'
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

export function CreateClassDialog() {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(async (prev: unknown, formData: FormData) => {
    const res = await createClassAction(null, formData)
    if (res.success) {
      setOpen(false)
    }
    return res
  }, null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ size: 'sm', className: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs' })}>
        <Plus className="w-3.5 h-3.5 mr-1.5" /> Create New Class
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">Create Live Class</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Set up a new edtech classroom for students to enroll and receive homework assignments.
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
            <Label htmlFor="name" className="text-xs font-semibold">Class Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Roblox Physics & Velocity Explorers"
              required
              className="text-sm focus-visible:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Overview of learning objectives, science experiments, or Roblox sandbox worlds..."
              rows={3}
              className="text-sm focus-visible:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="max_students" className="text-xs font-semibold">Capacity (Max Students)</Label>
            <Input
              id="max_students"
              name="max_students"
              type="number"
              defaultValue={15}
              min={1}
              max={100}
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
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Creating...
                </>
              ) : (
                'Create Class'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

