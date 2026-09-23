'use client'

import React, { useState, useTransition } from 'react'
import { updateUserAction, deleteUserAction, unlinkParentStudentAction } from '@/lib/actions/admin'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Shield,
  Unlink,
  Loader2,
  AlertCircle,
  AlertTriangle,
  GraduationCap,
  School,
  HeartHandshake,
} from 'lucide-react'
import type { UserRole } from '@/types'

interface LinkedChild {
  linkId: string
  studentId: string
  studentName: string
}

interface UserActionsProps {
  userId: string
  userName: string
  currentRole: UserRole
  linkedChildren?: LinkedChild[]
}

const ROLE_OPTIONS: { role: UserRole; label: string; icon: React.ElementType }[] = [
  { role: 'student', label: 'Student', icon: GraduationCap },
  { role: 'teacher', label: 'Teacher', icon: School },
  { role: 'parent', label: 'Parent', icon: HeartHandshake },
  { role: 'admin', label: 'Admin', icon: Shield },
]

export function UserActions({ userId, userName, currentRole, linkedChildren = [] }: UserActionsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [linksDialogOpen, setLinksDialogOpen] = useState(false)

  const [fullName, setFullName] = useState(userName)
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!fullName.trim()) {
      setError('Full name cannot be empty.')
      return
    }

    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('full_name', fullName.trim())
    formData.append('role', selectedRole)

    startTransition(async () => {
      const res = await updateUserAction(null, formData)
      if (!res.success) {
        setError(res.error || 'Failed to update user profile')
      } else {
        setEditDialogOpen(false)
      }
    })
  }

  const handleDeleteSubmit = () => {
    setError(null)
    const formData = new FormData()
    formData.append('userId', userId)

    startTransition(async () => {
      const res = await deleteUserAction(null, formData)
      if (!res.success) {
        setError(res.error || 'Failed to delete user')
      } else {
        setDeleteDialogOpen(false)
      }
    })
  }

  const handleUnlink = (linkId: string) => {
    setError(null)
    const formData = new FormData()
    formData.append('linkId', linkId)

    startTransition(async () => {
      const res = await unlinkParentStudentAction(null, formData)
      if (!res.success) {
        setError(res.error || 'Failed to unlink')
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-xs text-slate-500">Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="text-xs cursor-pointer"
            onClick={() => {
              setFullName(userName)
              setSelectedRole(currentRole)
              setError(null)
              setEditDialogOpen(true)
            }}
          >
            <Pencil className="w-3.5 h-3.5 mr-2 text-indigo-600" />
            Edit User Profile
          </DropdownMenuItem>

          {currentRole === 'parent' && linkedChildren.length > 0 && (
            <DropdownMenuItem
              className="text-xs cursor-pointer text-slate-700"
              onClick={() => {
                setError(null)
                setLinksDialogOpen(true)
              }}
            >
              <Unlink className="w-3.5 h-3.5 mr-2 text-amber-600" />
              Manage Linked Children ({linkedChildren.length})
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-xs cursor-pointer text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            onClick={() => {
              setError(null)
              setDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="w-3.5 h-3.5 mr-2 text-rose-600" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit User Modal */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Pencil className="w-4 h-4 text-indigo-600" />
                Edit User: {userName}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Update account details and administrative role permissions.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3.5 py-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isPending}
                  className="text-xs h-9"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">User Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLE_OPTIONS.map((opt) => {
                    const Icon = opt.icon
                    const isSelected = selectedRole === opt.role
                    return (
                      <button
                        key={opt.role}
                        type="button"
                        onClick={() => setSelectedRole(opt.role)}
                        disabled={isPending}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-600 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                            <span className="text-xs font-semibold">{opt.label}</span>
                          </div>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditDialogOpen(false)}
                disabled={isPending}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending || (fullName === userName && selectedRole === currentRole)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Modal */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Delete User Account
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Are you sure you want to delete <span className="font-semibold text-slate-900">{userName}</span>?
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-lg text-xs text-rose-800 space-y-1 my-2">
            <p className="font-semibold">⚠️ Irreversible Action</p>
            <p className="text-[11px] leading-relaxed">
              This will permanently delete the user credentials, profile records, and cascade across related enrollments and homework submissions.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleDeleteSubmit}
              disabled={isPending}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Deleting...
                </>
              ) : (
                'Yes, Delete User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Linked Children Modal */}
      <Dialog open={linksDialogOpen} onOpenChange={setLinksDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Linked Children ({userName})
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Remove parental link if a student account was linked incorrectly.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="divide-y divide-slate-100 py-2">
            {linkedChildren.map((child) => (
              <div key={child.linkId} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{child.studentName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">ID: {child.studentId.slice(0, 8)}...</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200 hover:border-rose-300"
                  onClick={() => handleUnlink(child.linkId)}
                  disabled={isPending}
                >
                  <Unlink className="w-3.5 h-3.5 mr-1" /> Unlink
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLinksDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
