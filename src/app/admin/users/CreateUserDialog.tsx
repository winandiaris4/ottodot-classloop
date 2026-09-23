'use client'

import React, { useState, useTransition } from 'react'
import { createUserAction } from '@/lib/actions/admin'
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
import { Input } from '@/components/ui/input'
import { UserPlus, Loader2, AlertCircle, CheckCircle2, Shield, School, GraduationCap, HeartHandshake } from 'lucide-react'
import type { UserRole } from '@/types'

const ROLE_OPTIONS: { role: UserRole; label: string; icon: React.ElementType; desc: string }[] = [
  { role: 'student', label: 'Student', icon: GraduationCap, desc: 'Access to homework and class schedule' },
  { role: 'teacher', label: 'Teacher', icon: School, desc: 'Manage classes, assign homework & grading' },
  { role: 'parent', label: 'Parent', icon: HeartHandshake, desc: 'Monitor child progress & schedules' },
  { role: 'admin', label: 'Admin', icon: Shield, desc: 'Full platform administration access' },
]

export function CreateUserDialog() {
  const [open, setOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('student')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    const formData = new FormData()
    formData.append('full_name', fullName.trim())
    formData.append('email', email.trim())
    formData.append('password', password)
    formData.append('role', selectedRole)

    startTransition(async () => {
      const res = await createUserAction(null, formData)
      if (!res.success) {
        setError(res.error || 'Failed to create user account')
      } else {
        setSuccess(true)
        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
          setFullName('')
          setEmail('')
          setPassword('')
          setSelectedRole('student')
        }, 1200)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({
          size: 'sm',
          className: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs cursor-pointer',
        })}
      >
        <UserPlus className="w-3.5 h-3.5 mr-1.5" />
        Add New User
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-600" />
              Create New Platform User
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Register a new user account with assigned role and credentials.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>User account created successfully!</span>
            </div>
          )}

          <div className="space-y-3.5 py-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <Input
                placeholder="e.g. Alexander Graham"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isPending || success}
                className="text-xs h-9"
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <Input
                type="email"
                placeholder="e.g. alexander@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending || success}
                className="text-xs h-9"
                required
              />
            </div>

            {/* Initial Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Password</label>
              <Input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending || success}
                className="text-xs h-9"
                required
                minLength={6}
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Assign User Role</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLE_OPTIONS.map((opt) => {
                  const Icon = opt.icon
                  const isSelected = selectedRole === opt.role
                  return (
                    <button
                      key={opt.role}
                      type="button"
                      onClick={() => setSelectedRole(opt.role)}
                      disabled={isPending || success}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                        <span className="text-xs font-semibold">{opt.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">{opt.desc}</p>
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
              onClick={() => setOpen(false)}
              disabled={isPending || success}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending || success}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
