import React from 'react'
import { getCachedAdminEnrollmentsData } from '@/lib/cache/admin-cache'
import { EnrollmentsTable } from './EnrollmentsTable'

export default async function AdminEnrollmentsPage() {
  const { enrollments, students, classes } = await getCachedAdminEnrollmentsData()

  return (
    <div className="space-y-6">
      <EnrollmentsTable
        enrollments={enrollments as any}
        students={students || []}
        classes={classes || []}
      />
    </div>
  )
}
