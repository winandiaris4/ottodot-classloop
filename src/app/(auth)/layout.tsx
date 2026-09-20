import React from 'react'
import Link from 'next/link'
import { GraduationCap, Sparkles, BookOpen, ShieldCheck } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Left Column: Visual & Value Proposition */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-12 text-white relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl" />

        {/* Brand Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-2xl tracking-tight text-white">ClassLoop</span>
              <span className="block text-xs text-indigo-300 font-medium -mt-1">Edtech Class Management</span>
            </div>
          </Link>
        </div>

        {/* Value Prop Carousel / Highlights */}
        <div className="relative z-10 space-y-8 my-auto max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Role Learning Ecosystem</span>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            Belajar menyenangkan, pantau progress secara transparan.
          </h1>

          <p className="text-indigo-200 text-sm leading-relaxed">
            Menghubungkan murid, orang tua, guru, dan admin dalam satu platform terpadu dengan sistem keamanan Row Level Security tingkat tinggi.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-indigo-700/50">
            <div className="flex items-start gap-2.5">
              <BookOpen className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Interactive Tasks</p>
                <p className="text-xs text-indigo-300">Submit homework & terima feedback terarah</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Parent Visibility</p>
                <p className="text-xs text-indigo-300">Pantau perkembangan anak secara berkala</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-indigo-400/80">
          © {new Date().getFullYear()} ClassLoop Platform. Built for Ottodot Full Stack Engineer Role.
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}

