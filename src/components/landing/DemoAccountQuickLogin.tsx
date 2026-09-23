'use client'

import React, { useTransition, useState } from 'react'
import { GraduationCap, School, Users, ShieldCheck, Loader2, ArrowRight } from 'lucide-react'
import { loginAction } from '@/lib/actions/auth'

const DEMO_USERS = [
  {
    role: 'Student',
    email: 'student@demo.com',
    password: 'DemoPassword123!',
    tag: 'Ready to explore',
    icon: GraduationCap,
    iconBg: 'bg-indigo-100 text-indigo-600 border-indigo-200',
    hoverBorder: 'hover:border-indigo-300 hover:shadow-indigo-100/80',
    badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    role: 'Teacher',
    email: 'teacher@demo.com',
    password: 'DemoPassword123!',
    tag: 'Ready to explore',
    icon: School,
    iconBg: 'bg-rose-100 text-rose-600 border-rose-200',
    hoverBorder: 'hover:border-rose-300 hover:shadow-rose-100/80',
    badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    role: 'Parent',
    email: 'parent@demo.com',
    password: 'DemoPassword123!',
    tag: 'Ready to explore',
    icon: Users,
    iconBg: 'bg-amber-100 text-amber-600 border-amber-200',
    hoverBorder: 'hover:border-amber-300 hover:shadow-amber-100/80',
    badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    role: 'Admin',
    email: 'admin@demo.com',
    password: 'DemoPassword123!',
    tag: 'Ready to explore',
    icon: ShieldCheck,
    iconBg: 'bg-teal-100 text-teal-600 border-teal-200',
    hoverBorder: 'hover:border-teal-300 hover:shadow-teal-100/80',
    badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
]

export function DemoAccountQuickLogin() {
  const [isPending, startTransition] = useTransition()
  const [activeEmail, setActiveEmail] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleInstantLogin = (email: string, pass: string) => {
    setActiveEmail(email)
    setErrorMessage(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', pass)
      const res = await loginAction(null, formData)
      if (res?.error) {
        setErrorMessage(res.error)
        setActiveEmail(null)
      }
    })
  }

  return (
    <div className="w-full">
      {errorMessage && (
        <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {DEMO_USERS.map((user) => {
          const Icon = user.icon
          const isCurrentLoading = isPending && activeEmail === user.email

          return (
            <button
              key={user.email}
              type="button"
              disabled={isPending}
              onClick={() => handleInstantLogin(user.email, user.password)}
              className={`group text-left p-3.5 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer flex items-center gap-3.5 ${user.hoverBorder} ${
                isCurrentLoading ? 'opacity-80 ring-2 ring-indigo-500' : ''
              }`}
            >
              <div
                className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${user.iconBg}`}
              >
                {isCurrentLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-indigo-600 transition-colors">
                    {user.role}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono truncate">{user.email}</div>
                <div className="text-[10px] text-emerald-600/90 font-medium pt-0.5 flex items-center gap-1">
                  {isCurrentLoading ? 'Entering Dashboard...' : user.tag}
                  {!isCurrentLoading && (
                    <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-slate-400" />
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

