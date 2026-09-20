import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, TrendingUp, CheckCircle, Calendar, ArrowRight, Sparkles, UserPlus } from 'lucide-react'

export default async function ParentDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-xl space-y-2">
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-xs">
            <Sparkles className="w-3 h-3 mr-1" /> Parent Visibility Hub
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Pantau perkembangan belajar anak Anda. 🌟
          </h2>
          <p className="text-amber-100 text-sm">
            Dapatkan visibilitas real-time terhadap tugas yang dikerjakan, feedback guru, dan jadwal live class anak Anda.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Anak Terdaftar
            </CardTitle>
            <Users className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-[11px] text-slate-500 mt-1">Anak ditautkan</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completion Rate
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0%</div>
            <p className="text-[11px] text-slate-500 mt-1">Penyelesaian homework</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rata-rata Nilai
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">-</div>
            <p className="text-[11px] text-slate-500 mt-1">Bulan ini</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Jadwal Kelas
            </CardTitle>
            <Calendar className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-[11px] text-slate-500 mt-1">Sesi minggu ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Children list & Progress */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Daftar Anak</CardTitle>
                <CardDescription className="text-xs">Ringkasan aktivitas akademik anak Anda</CardDescription>
              </div>
              <Link
                href="/parent/children"
                className={buttonVariants({ variant: 'outline', size: 'sm', className: 'text-xs' })}
              >
                Detail <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center text-slate-400 space-y-2">
                <UserPlus className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Belum ada anak yang ditautkan</p>
                <p className="text-xs text-slate-400">Admin akan menautkan akun anak ke akun orang tua Anda.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Recent Feedback */}
        <div className="space-y-4">
          <Card className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Feedback Guru Terbaru</CardTitle>
                <CardDescription className="text-xs">Catatan perkembangan dari guru</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center text-slate-400 space-y-2">
                <CheckCircle className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Belum ada catatan baru</p>
                <p className="text-xs text-slate-400">Feedback guru akan muncul setelah tugas anak dinilai.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
