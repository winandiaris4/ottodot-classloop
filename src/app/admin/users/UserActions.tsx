'use client'

import React, { useState, useTransition } from 'react'
import { updateUserRoleAction, unlinkParentStudentAction } from '@/lib/actions/admin'
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
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Shield, UserCog, Unlink, Loader2, AlertCircle } from 'lucide-react'

interface LinkedChild {
  linkId: string
  studentId: string
  studentName: string
}

interface UserActionsProps {
  userId: string
  userName: string
  currentRole: 'admin' | 'teacher' | 'student' | 'parent'
  linkedChildren?: LinkedChild[]
}

export function UserActions({ userId, userName, currentRole, linkedChildren = [] }: UserActionsProps) {
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [linksDialogOpen, setLinksDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(currentRole)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleRoleChange = () => {
    setError(null)
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('role', selectedRole)

    startTransition(async () => {
      const res = await updateUserRoleAction(null, formData)
      if (!res.success) {
        setError(res.error || 'Failed to update role')
      } else {
        setRoleDialogOpen(false)
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
        <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100">
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-xs text-slate-500">Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="text-xs cursor-pointer"
            onClick={() => setRoleDialogOpen(true)}
          >
            <UserCog className="w-3.5 h-3.5 mr-2 text-indigo-600" />
            Change User Role
          </DropdownMenuItem>
          {currentRole === 'parent' && linkedChildren.length > 0 && (
            <DropdownMenuItem
              className="text-xs cursor-pointer text-slate-700"
              onClick={() => setLinksDialogOpen(true)}
            >
              <Unlink className="w-3.5 h-3.5 mr-2 text-rose-600" />
              Manage Linked Children ({linkedChildren.length})
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Role Change Modal */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              Update Role for {userName}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Modifying user roles changes their platform permissions, sidebar access, and dashboard experience.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2 py-2">
            <label className="text-xs font-semibold text-slate-700">Select Role</label>
            <div className="grid grid-cols-2 gap-2">
              {(['student', 'teacher', 'parent', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`p-3 rounded-lg border text-left text-xs font-semibold capitalize transition-all ${
                    selectedRole === r
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{r}</span>
                    {selectedRole === r && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRoleDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleRoleChange}
              disabled={isPending || selectedRole === currentRole}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving...
                </>
              ) : (
                'Save Changes'
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
                  <div className="text-[11px] text-slate-400">ID: {child.studentId.slice(0, 8)}...</div>
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
