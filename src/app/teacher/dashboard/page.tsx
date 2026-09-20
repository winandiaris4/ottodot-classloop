import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { School, ClipboardCheck, Users, Calendar, Plus, ArrowRight, Sparkles } from 'lucide-react'

export default async function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-xl space-y-2">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
            <Sparkles className="w-3 h-3 mr-1" /> Teacher Workspace
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Halo Guru, kelola kelas Anda dengan efisien. 📚
          </h2>
          <p className="text-blue-200 text-sm">
            Pantau submission murid, berikan feedback terarah, dan atur materi homework dalam satu tempat.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Kelas Aktif
            </CardTitle>
            <School className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-[11px] text-slate-500 mt-1">Kelas yang Anda ampu</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Perlu Dinilai
            </CardTitle>
            <ClipboardCheck className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-[11px] text-slate-500 mt-1">Submission menunggu review</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Murid
            </CardTitle>
            <Users className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-[11px] text-slate-500 mt-1">Enrolled across classes</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sesi Hari Ini
            </CardTitle>
            <Calendar className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-[11px] text-slate-500 mt-1">Jadwal mengajar</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Class Roster & Active Homework */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Kelas Saya</CardTitle>
                <CardDescription className="text-xs">Daftar kelas yang sedang berlangsung</CardDescription>
              </div>
              <Link
                href="/teacher/classes"
                className={buttonVariants({ size: 'sm', className: 'text-xs bg-indigo-600 hover:bg-indigo-700 text-white' })}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Buat Kelas Baru
              </Link>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center text-slate-400 space-y-2">
                <School className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Belum ada kelas yang dibuat</p>
                <p className="text-xs text-slate-400">Mulai dengan membuat kelas pertama Anda untuk menambahkan murid & tugas.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Pending Submissions review */}
        <div className="space-y-4">
          <Card className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Tugas & Penilaian</CardTitle>
                <CardDescription className="text-xs">Submission yang siap dinilai</CardDescription>
              </div>
              <Link
                href="/teacher/homework"
                className={buttonVariants({ variant: 'outline', size: 'sm', className: 'text-xs' })}
              >
                Semua <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center text-slate-400 space-y-2">
                <ClipboardCheck className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Semua tugas telah dinilai</p>
                <p className="text-xs text-slate-400">Tidak ada antrean penilaian saat ini.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
