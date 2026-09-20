import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, School, CreditCard, BarChart3, UserPlus, ArrowRight, ShieldCheck, Link2 } from 'lucide-react'

export default async function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-900 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-xl space-y-2">
          <Badge className="bg-rose-500/20 text-rose-300 border-rose-400/30 text-xs">
            <ShieldCheck className="w-3 h-3 mr-1" /> Admin Operations
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            ClassLoop System Administration 🛡️
          </h2>
          <p className="text-slate-300 text-sm">
            Kelola data pengguna, tautkan relasi orang tua ke murid, pantau enrollment kelas, dan akses laporan operasional.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Pengguna
            </CardTitle>
            <Users className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-[11px] text-slate-500 mt-1">Semua role aktif</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Kelas Berjalan
            </CardTitle>
            <School className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-[11px] text-slate-500 mt-1">Status active</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrollment Aktif
            </CardTitle>
            <CreditCard className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-[11px] text-slate-500 mt-1">Murid terdaftar</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completion Rate
            </CardTitle>
            <BarChart3 className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0%</div>
            <p className="text-[11px] text-slate-500 mt-1">Platform average</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Quick Action Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: User Management Overview */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Manajemen Pengguna</CardTitle>
                <CardDescription className="text-xs">Kelola peran dan status akun murid, guru, dan orang tua</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/admin/users"
                  className={buttonVariants({ size: 'sm', className: 'text-xs bg-indigo-600 hover:bg-indigo-700 text-white' })}
                >
                  <UserPlus className="w-3.5 h-3.5 mr-1" /> Kelola User
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Users className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Belum ada aktivitas user</p>
                <p className="text-xs text-slate-400">Daftar pengguna yang mendaftar akan dimuat di sini.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Quick Links */}
        <div className="space-y-4">
          <Card className="border-slate-200/80">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Aksi Cepat Operasional</CardTitle>
              <CardDescription className="text-xs">Pintasan tugas admin harian</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <Link
                href="/admin/users"
                className={buttonVariants({ variant: 'outline', className: 'w-full justify-between text-xs font-medium' })}
              >
                <span className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-indigo-600" />
                  Tautkan Parent ke Student
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/admin/enrollments"
                className={buttonVariants({ variant: 'outline', className: 'w-full justify-between text-xs font-medium' })}
              >
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Kelola Enrollment Kelas
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/admin/reports"
                className={buttonVariants({ variant: 'outline', className: 'w-full justify-between text-xs font-medium' })}
              >
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Lihat Laporan Operasional
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
