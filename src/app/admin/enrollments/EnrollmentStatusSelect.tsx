'use client'

import React, { useTransition } from 'react'
import { updateEnrollmentStatusAction } from '@/lib/actions/admin'
import { Loader2 } from 'lucide-react'

interface EnrollmentStatusSelectProps {
  enrollmentId: string
  currentStatus: string
}

export function EnrollmentStatusSelect({ enrollmentId, currentStatus }: EnrollmentStatusSelectProps) {
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (newStatus: string) => {
    const formData = new FormData()
    formData.append('enrollmentId', enrollmentId)
    formData.append('status', newStatus)

    startTransition(async () => {
      await updateEnrollmentStatusAction(null, formData)
    })
  }

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={currentStatus}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={isPending}
        className={`h-7 rounded-md border text-[11px] font-medium px-2 py-0.5 focus:outline-none transition-colors ${
          currentStatus === 'active'
            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
            : currentStatus === 'completed'
            ? 'border-blue-300 bg-blue-50 text-blue-800'
            : 'border-slate-300 bg-slate-50 text-slate-600'
        }`}
      >
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      {isPending && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
    </div>
  )
}
