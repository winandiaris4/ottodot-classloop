'use client'

import React, { useState, useMemo } from 'react'
import { LinkParentDialog } from './LinkParentDialog'
import { UserActions } from './UserActions'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  School,
  HeartHandshake,
  ShieldCheck,
  UserCheck,
} from 'lucide-react'

interface UserProfile {
  id: string
  full_name: string
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

export function UsersListTable({ users, links }: UsersListTableProps) {
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

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
        user.full_name.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
      return matchesRole && matchesSearch
    })
  }, [users, selectedRole, searchQuery])

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Platform Users Directory</h2>
          <p className="text-xs text-slate-500">
            Total {users.length} registered accounts across teachers, students, parents, and administrators
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LinkParentDialog parents={parentsList} students={studentsList} />
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'
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
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs h-8.5 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">User Profile</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Connections / Details</th>
                <th className="px-4 py-3">Joined Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">No users found matching filter</p>
                    <p className="text-[11px] text-slate-400">Try adjusting your search or role selection.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const children = parentLinksMap.get(user.id) || []
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {user.full_name?.charAt(0) || 'U'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {user.full_name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate font-mono">
                              {user.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] uppercase font-semibold ${
                            user.role === 'teacher'
                              ? 'bg-blue-100 text-blue-700'
                              : user.role === 'student'
                              ? 'bg-indigo-100 text-indigo-700'
                              : user.role === 'parent'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {user.role === 'parent' ? (
                          children.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {children.map((c) => (
                                <span
                                  key={c.linkId}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] border border-emerald-200"
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
                          <span className="text-[11px] text-slate-500">Instructor Account</span>
                        ) : user.role === 'student' ? (
                          <span className="text-[11px] text-slate-500">Enrolled Student</span>
                        ) : (
                          <span className="text-[11px] text-slate-500">System Admin</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-[11px]">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
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
      </div>
    </div>
  )
}

