'use client'

import React, { useState, useMemo } from 'react'
import { EnrollStudentDialog } from './EnrollStudentDialog'
import { EnrollmentStatusSelect } from './EnrollmentStatusSelect'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  CreditCard,
  Search,
  BookOpen,
  GraduationCap,
  Calendar,
  School,
  CheckCircle2,
  Clock,
  Ban,
} from 'lucide-react'

interface Student {
  id: string
  full_name: string
}

interface ClassItem {
  id: string
  name: string
  max_students: number
  teacher?: {
    full_name: string
  } | null
}

interface Enrollment {
  id: string
  status: string
  enrolled_at: string
  student_id: string
  class_id: string
  student?: Student | null
  class?: ClassItem | null
}

interface EnrollmentsTableProps {
  enrollments: Enrollment[]
  students: Student[]
  classes: ClassItem[]
}

export function EnrollmentsTable({ enrollments, students, classes }: EnrollmentsTableProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((enr) => {
      const matchesStatus = selectedStatus === 'all' || enr.status === selectedStatus
      const query = searchQuery.toLowerCase().trim()
      const studentName = enr.student?.full_name?.toLowerCase() || ''
      const className = enr.class?.name?.toLowerCase() || ''
      const matchesSearch = !query || studentName.includes(query) || className.includes(query)
      return matchesStatus && matchesSearch
    })
  }, [enrollments, selectedStatus, searchQuery])

  const statusCounts = useMemo(() => {
    return {
      all: enrollments.length,
      active: enrollments.filter((e) => e.status === 'active').length,
      completed: enrollments.filter((e) => e.status === 'completed').length,
      cancelled: enrollments.filter((e) => e.status === 'cancelled').length,
    }
  }, [enrollments])

  return (
    <div className="space-y-4">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Class Enrollments</h2>
          <p className="text-xs text-slate-500">
            Audit and manage student class assignments, registration dates, and course status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <EnrollStudentDialog students={students} classes={classes} />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Enrollments', count: statusCounts.all, icon: CreditCard },
            { id: 'active', label: 'Active', count: statusCounts.active, icon: CheckCircle2 },
            { id: 'completed', label: 'Completed', count: statusCounts.completed, icon: Clock },
            { id: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled, icon: Ban },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = selectedStatus === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200/90 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-indigo-100/90 text-indigo-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search student or class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs h-8.5 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Enrolled Class</th>
                <th className="px-4 py-3">Instructor</th>
                <th className="px-4 py-3">Enrolled On</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    <CreditCard className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">No enrollments found</p>
                    <p className="text-[11px] text-slate-400">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((enr) => {
                  const studentName = enr.student?.full_name || 'Enrolled Student'
                  const className = enr.class?.name || 'Class Session'
                  const teacherName = enr.class?.teacher?.full_name || 'Instructor'

                  return (
                    <tr key={enr.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-[11px]">
                            {studentName.charAt(0)}
                          </div>
                          <div>
                            <div>{studentName}</div>
                            <div className="text-[10px] text-slate-400 font-normal font-mono">
                              {enr.student_id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-800 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                          {className}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className="flex items-center gap-1">
                          <School className="w-3 h-3 text-slate-400" />
                          {teacherName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-[11px]">
                        {new Date(enr.enrolled_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <EnrollmentStatusSelect
                          enrollmentId={enr.id}
                          currentStatus={enr.status}
                        />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

