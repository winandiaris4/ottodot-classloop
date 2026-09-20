'use client'

import React, { useActionState, useState } from 'react'
import Link from 'next/link'
import { registerAction } from '@/lib/actions/auth'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button, buttonVariants } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UserPlus, AlertCircle, CheckCircle2, Loader2, GraduationCap, Users, User, ShieldAlert } from 'lucide-react'

const ROLES = [
  { id: 'student', title: 'Student', desc: 'Murid (belajar & tugas)', icon: GraduationCap },
  { id: 'parent', title: 'Parent', desc: 'Orang tua (pantau anak)', icon: Users },
  { id: 'teacher', title: 'Teacher', desc: 'Guru (kelola kelas)', icon: User },
  { id: 'admin', title: 'Admin', desc: 'Pengelola platform', icon: ShieldAlert },
]

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null)
  const [selectedRole, setSelectedRole] = useState('student')

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-600" />
            Daftar Akun Baru
          </CardTitle>
          <CardDescription>
            Pilih peran Anda dan buat akun untuk memulai di ClassLoop.
          </CardDescription>
        </CardHeader>

        {state?.success ? (
          <CardContent className="space-y-4 py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-slate-900">Pendaftaran Berhasil!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Akun Anda telah berhasil dibuat. Silakan masuk menggunakan email dan password yang telah Anda daftarkan.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/login"
                className={buttonVariants({ className: 'w-full bg-indigo-600 hover:bg-indigo-700 text-white' })}
              >
                Lanjut ke Halaman Masuk
              </Link>
            </div>
          </CardContent>
        ) : (
          <form action={formAction}>
            <CardContent className="space-y-4">
              {state?.error && (
                <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-sm">{state.error}</AlertDescription>
                </Alert>
              )}

              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Pilih Peran Akun (Role)</Label>
                <input type="hidden" name="role" value={selectedRole} />
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => {
                    const Icon = r.icon
                    const isSelected = selectedRole === r.id
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRole(r.id)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs ring-1 ring-indigo-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold leading-none">{r.title}</div>
                          <div className="text-[10px] text-slate-500 truncate mt-1">{r.desc}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name">Nama Lengkap</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  required
                  className="focus-visible:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  required
                  autoComplete="email"
                  className="focus-visible:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  required
                  autoComplete="new-password"
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
                    Mendaftarkan...
                  </>
                ) : (
                  'Daftar Sekarang'
                )}
              </Button>
            </CardContent>
          </form>
        )}

        <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 pt-4 text-center">
          <p className="text-xs text-slate-500">
            Sudah memiliki akun?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
