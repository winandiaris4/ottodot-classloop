import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Calendar, CheckCircle2, Clock, ArrowRight, Sparkles } from 'lucide-react'

export default async function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-xl space-y-2">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs">
            <Sparkles className="w-3 h-3 mr-1" /> Student Dashboard
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Selamat datang kembali di ClassLoop! 🚀
          </h2>
          <p className="text-indigo-200 text-sm">
            Periksa tugas terbaru yang harus dikumpulkan dan jadwal sesi live class kamu hari ini.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Homework Pending
            </CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-[11px] text-slate-500 mt-1">Menunggu dikerjakan</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Telah Dinilai
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-[11px] text-slate-500 mt-1">Nilai & feedback masuk</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Kelas Terdaftar
            </CardTitle>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-[11px] text-slate-500 mt-1">Kelas aktif</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sesi Hari Ini
            </CardTitle>
            <Calendar className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-[11px] text-slate-500 mt-1">Jadwal belajar</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Homework */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Homework Terbaru</CardTitle>
                <CardDescription className="text-xs">Tugas yang perlu kamu kumpulkan segera</CardDescription>
              </div>
              <Link
                href="/student/homework"
                className={buttonVariants({ variant: 'outline', size: 'sm', className: 'text-xs' })}
              >
                Lihat Semua <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center text-slate-400 space-y-2">
                <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Belum ada tugas baru</p>
                <p className="text-xs text-slate-400">Guru Anda belum memberikan tugas baru untuk kelas ini.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Class Schedule */}
        <div className="space-y-4">
          <Card className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Jadwal Kelas</CardTitle>
                <CardDescription className="text-xs">Sesi yang akan datang</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Calendar className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Tidak ada jadwal hari ini</p>
                <p className="text-xs text-slate-400">Jadwal kelas akan muncul di sini.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
