'use client'

import React, { useActionState, useState } from 'react'
import Link from 'next/link'
import { loginAction } from '@/lib/actions/auth'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { LogIn, AlertCircle, Sparkles, User, GraduationCap, Users, ShieldAlert, Loader2 } from 'lucide-react'

// Demo accounts metadata for instant 1-click testing
const DEMO_ACCOUNTS = [
  { role: 'Student', email: 'student@demo.com', password: 'DemoPassword123!', icon: GraduationCap, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { role: 'Teacher', email: 'teacher@demo.com', password: 'DemoPassword123!', icon: User, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { role: 'Parent', email: 'parent@demo.com', password: 'DemoPassword123!', icon: Users, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { role: 'Admin', email: 'admin@demo.com', password: 'DemoPassword123!', icon: ShieldAlert, color: 'bg-rose-50 text-rose-700 border-rose-200' },
]

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
  }

  return (
    <div className="space-y-6">
      {/* Mobile Branding (only on small screens) */}
      <div className="lg:hidden text-center space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">ClassLoop</h1>
        <p className="text-sm text-slate-500">Edtech Class Management Platform</p>
      </div>

      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <LogIn className="w-5 h-5 text-indigo-600" />
            Masuk ke Akun
          </CardTitle>
          <CardDescription>
            Masukkan email dan password untuk mengakses dashboard Anda.
          </CardDescription>
        </CardHeader>

        <form action={formAction}>
          <CardContent className="space-y-4">
            {state?.error && (
              <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-sm">{state.error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="focus-visible:ring-indigo-500"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                'Masuk'
              )}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 pt-4 text-center">
          <p className="text-xs text-slate-500">
            Belum memiliki akun?{' '}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              Daftar akun baru
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Demo Accounts Quick-Fill Panel */}
      <Card className="border-indigo-100 bg-indigo-50/40 shadow-none">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Demo Accounts Quick-Fill
            </span>
            <Badge variant="outline" className="text-[10px] bg-indigo-100/70 border-indigo-200 text-indigo-700">
              1-Click Fill
            </Badge>
          </div>
          <p className="text-[11px] text-slate-500 pt-0.5">
            Klik salah satu role untuk mengisi data demo secara instan:
          </p>
        </CardHeader>
        <CardContent className="p-4 pt-1 grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((acc) => {
            const Icon = acc.icon
            return (
              <button
                key={acc.role}
                type="button"
                onClick={() => handleQuickFill(acc.email, acc.password)}
                className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs font-medium transition-all hover:scale-[1.02] active:scale-[0.98] ${acc.color}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold leading-tight">{acc.role}</div>
                  <div className="text-[10px] opacity-75 truncate">{acc.email}</div>
                </div>
              </button>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
