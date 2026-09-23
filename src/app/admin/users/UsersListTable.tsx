'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { LinkParentDialog } from './LinkParentDialog'
import { CreateUserDialog } from './CreateUserDialog'
import { UserActions } from './UserActions'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Users,
  Search,
  GraduationCap,
  School,
  HeartHandshake,
  ShieldCheck,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Mail,
  RotateCcw,
} from 'lucide-react'

interface UserProfile {
  id: string
  full_name: string
  email?: string | null
  avatar_url: string | null
  role: 'admin' | 'teacher' | 'student' | 'parent'
  created_at: string
}

interface ParentStudentLink {
  id: string
  parent_id: string
  student_id: string
  student?: {
    id: string
    full_name: string
  } | null
}

interface UsersListTableProps {
  users: UserProfile[]
  links: ParentStudentLink[]
}

function CopyableIdPill({ id }: { id: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Click to copy full User ID"
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-500 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors cursor-pointer group"
    >
      <span>#{id.slice(0, 8)}</span>
      {copied ? (
        <Check className="w-2.5 h-2.5 text-emerald-600 font-bold" />
      ) : (
        <Copy className="w-2.5 h-2.5 text-slate-400 group-hover:text-slate-600" />
      )}
      {copied && <span className="text-[9px] text-emerald-600 font-sans font-semibold">Copied</span>}
    </button>
  )
}

export function UsersListTable({ users, links }: UsersListTableProps) {
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  // Map parent ID to their linked children
  const parentLinksMap = useMemo(() => {
    const map = new Map<string, { linkId: string; studentId: string; studentName: string }[]>()
    links.forEach((l) => {
      const existing = map.get(l.parent_id) || []
      existing.push({
        linkId: l.id,
        studentId: l.student_id,
        studentName: l.student?.full_name || 'Enrolled Student',
      })
      map.set(l.parent_id, existing)
    })
    return map
  }, [links])

  const parentsList = useMemo(() => {
    return users.filter((u) => u.role === 'parent').map((u) => ({ id: u.id, full_name: u.full_name }))
  }, [users])

  const studentsList = useMemo(() => {
    return users.filter((u) => u.role === 'student').map((u) => ({ id: u.id, full_name: u.full_name }))
  }, [users])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = selectedRole === 'all' || user.role === selectedRole
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        user.full_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
      return matchesRole && matchesSearch
    })
  }, [users, selectedRole, searchQuery])

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedRole, searchQuery, pageSize])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const paginatedUsers = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize
    return filteredUsers.slice(startIdx, startIdx + pageSize)
  }, [filteredUsers, currentPage, pageSize])

  const startRecord = filteredUsers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endRecord = Math.min(currentPage * pageSize, filteredUsers.length)

  const roleCounts = useMemo(() => {
    return {
      all: users.length,
      teacher: users.filter((u) => u.role === 'teacher').length,
      student: users.filter((u) => u.role === 'student').length,
      parent: users.filter((u) => u.role === 'parent').length,
      admin: users.filter((u) => u.role === 'admin').length,
    }
  }, [users])

  return (
    <div className="space-y-4">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Platform Users Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage system access, identities, and parent-student linkages across all platform roles.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <LinkParentDialog parents={parentsList} students={studentsList} />
          <CreateUserDialog />
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-2xs">
        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Users', count: roleCounts.all, icon: Users },
            { id: 'teacher', label: 'Teachers', count: roleCounts.teacher, icon: School },
            { id: 'student', label: 'Students', count: roleCounts.student, icon: GraduationCap },
            { id: 'parent', label: 'Parents', count: roleCounts.parent, icon: HeartHandshake },
            { id: 'admin', label: 'Admins', count: roleCounts.admin, icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = selectedRole === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedRole(tab.id)}
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
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8.5 text-xs h-8.5 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-2.5">User Identity</th>
                <th className="px-4 py-2.5">Role</th>
                <th className="px-4 py-2.5">Connections / Details</th>
                <th className="px-4 py-2.5">Joined Date</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700 text-sm">No users found</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      No registered users matched your search criteria or role filter.
                    </p>
                    {(searchQuery || selectedRole !== 'all') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRole('all')
                          setSearchQuery('')
                        }}
                        className="mt-3 text-xs border-slate-200"
                      >
                        <RotateCcw className="w-3 h-3 mr-1.5" /> Reset Filters
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const children = parentLinksMap.get(user.id) || []
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* User Profile / Identity */}
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {user.full_name}
                              </p>
                              <CopyableIdPill id={user.id} />
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{user.email || 'No email attached'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-4 py-2.5">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${
                            user.role === 'teacher'
                              ? 'bg-blue-50 text-blue-700 border-blue-200/80'
                              : user.role === 'student'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
                              : user.role === 'parent'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                              : 'bg-purple-50 text-purple-700 border-purple-200/80'
                          }`}
                        >
                          {user.role}
                        </Badge>
                      </td>

                      {/* Connections / Details */}
                      <td className="px-4 py-2.5">
                        {user.role === 'parent' ? (
                          children.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {children.map((c) => (
                                <span
                                  key={c.linkId}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200/80"
                                >
                                  <GraduationCap className="w-3 h-3 text-emerald-600" />
                                  {c.studentName}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No linked children</span>
                          )
                        ) : user.role === 'teacher' ? (
                          <span className="text-[11px] text-slate-600 font-medium">Instructor Account</span>
                        ) : user.role === 'student' ? (
                          <span className="text-[11px] text-slate-600 font-medium">Enrolled Student</span>
                        ) : (
                          <span className="text-[11px] text-slate-600 font-medium">System Administrator</span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="px-4 py-2.5 text-slate-500 text-[11px]">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-2.5 text-right">
                        <UserActions
                          userId={user.id}
                          userName={user.full_name}
                          currentRole={user.role}
                          linkedChildren={children}
                        />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Data Table Footer & Pagination */}
        <div className="px-4 py-3 bg-slate-50/60 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span>
              Showing <span className="font-semibold text-slate-900">{startRecord}</span> to{' '}
              <span className="font-semibold text-slate-900">{endRecord}</span> of{' '}
              <span className="font-semibold text-slate-900">{filteredUsers.length}</span> users
            </span>

            {/* Rows Per Page Selector */}
            <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Pagination Navigation */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage <= 1}
              className="h-7 w-7 p-0 border-slate-200 text-slate-600 disabled:opacity-40"
              title="First Page"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="h-7 px-2 border-slate-200 text-slate-600 text-xs disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-0.5" /> Previous
            </Button>

            <span className="px-2 text-xs font-medium text-slate-700">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="h-7 px-2 border-slate-200 text-slate-600 text-xs disabled:opacity-40"
            >
              Next <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="h-7 w-7 p-0 border-slate-200 text-slate-600 disabled:opacity-40"
              title="Last Page"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

