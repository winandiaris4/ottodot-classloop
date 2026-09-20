'use client'

import React, { useState, useActionState } from 'react'
import { enrollStudentAction, ActionResult } from '@/lib/actions/admin'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PlusCircle, AlertCircle, CheckCircle2, Loader2, BookOpen } from 'lucide-react'

interface StudentOption {
  id: string
  full_name: string
}

interface ClassOption {
  id: string
  name: string
  max_students: number
}

interface EnrollStudentDialogProps {
  students: StudentOption[]
  classes: ClassOption[]
}

export function EnrollStudentDialog({ students, classes }: EnrollStudentDialogProps) {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(async (prev: ActionResult | null, formData: FormData) => {
    const res = await enrollStudentAction(prev, formData)
    if (res.success) {
      setTimeout(() => setOpen(false), 1200)
    }
    return res
  }, null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ className: 'bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm' })}>
        <PlusCircle className="w-4 h-4 mr-1.5" /> Direct Enroll Student
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Enroll Student in Class
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Directly enroll a student into an active STEM class session without requiring Stripe checkout.
          </DialogDescription>
        </DialogHeader>

        {state?.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {state?.success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Student successfully enrolled into class!</span>
          </div>
        )}

        <form action={formAction} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="studentId" className="text-xs font-semibold text-slate-700">
              Select Student <span className="text-red-500">*</span>
            </Label>
            <select
              id="studentId"
              name="studentId"
              required
              className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">-- Choose a student --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name} ({s.id.slice(0, 8)}...)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="classId" className="text-xs font-semibold text-slate-700">
              Select Target Class <span className="text-red-500">*</span>
            </Label>
            <select
              id="classId"
              name="classId"
              required
              className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">-- Choose a class --</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Max: {c.max_students})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-xs font-semibold text-slate-700">
              Initial Enrollment Status
            </Label>
            <select
              id="status"
              name="status"
              defaultValue="active"
              className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="active">Active (Enrolled)</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Enrolling...
                </>
              ) : (
                'Enroll Student'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
