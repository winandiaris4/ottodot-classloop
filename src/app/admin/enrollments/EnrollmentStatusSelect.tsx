'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { updateEnrollmentStatusAction } from '@/lib/actions/admin'
import { Loader2 } from 'lucide-react'

interface EnrollmentStatusSelectProps {
  enrollmentId: string
  currentStatus: string
}

export function EnrollmentStatusSelect({ enrollmentId, currentStatus }: EnrollmentStatusSelectProps) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<string>(currentStatus)

  useEffect(() => {
    setStatus(currentStatus)
  }, [currentStatus])

  const handleStatusChange = (newStatus: string) => {
    const prevStatus = status
    setStatus(newStatus)

    const formData = new FormData()
    formData.append('enrollmentId', enrollmentId)
    formData.append('status', newStatus)

    startTransition(async () => {
      const res = await updateEnrollmentStatusAction(null, formData)
      if (!res.success) {
        setStatus(prevStatus)
        alert(res.error || 'Failed to update enrollment status')
      }
    })
  }

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={isPending}
        className={`h-7 rounded-md border text-[11px] font-semibold px-2 py-0.5 focus:outline-none transition-colors cursor-pointer ${
          status === 'active'
            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
            : status === 'completed'
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


