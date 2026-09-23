import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import {
  Rocket,
  ArrowRight,
  CheckCircle2,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  GraduationCap,
  School,
  HeartHandshake,
  Server,
  Sparkles,
  Database,
  Cloud,
  FileCode2,
  BarChart3,
  Lock,
  ExternalLink,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About ClassLoop | Next-Gen EdTech & Architecture',
  description:
    'Comprehensive overview of ClassLoop by Ottodot: platform purpose, operational workflows, modern tech stack, future expert roadmap, and enterprise system design.',
}

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0d1532] text-slate-900 flex flex-col selection:bg-emerald-400 selection:text-slate-900 font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0d1532]/90 backdrop-blur-md border-b border-indigo-950/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block leading-tight">ClassLoop</span>
              <span className="text-[11px] font-semibold text-indigo-300/80 block tracking-wide">
                for Little Learners
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <Link href="/" className="hover:text-emerald-300 transition-colors">Home</Link>
            <Link href="/courses" className="hover:text-emerald-300 transition-colors">Courses</Link>
            <Link href="/about" className="text-emerald-400 font-bold border-b-2 border-emerald-400 pb-1">About</Link>
            <a href="/#pricing" className="hover:text-emerald-300 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/winandiaris4/ottodot-classloop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all hover:scale-105"
            >
              <GithubIcon className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub Source</span>
            </a>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
            >
              Try Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 bg-[#0d1532] text-white">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-12 left-1/4 w-2 h-2 rounded-full bg-amber-300 animate-ping opacity-75" />
          <div className="absolute top-1/3 right-10 w-3 h-3 rounded-full bg-cyan-300 blur-[1px] opacity-80" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-emerald-500/20 rounded-full blur-[140px] -z-10" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-900/60 border border-indigo-700/60 text-indigo-200 text-xs sm:text-sm font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Platform Overview & Engineering Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            About <span className="text-emerald-400">ClassLoop</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-normal">
            A next-generation gamified STEM learning management ecosystem built for <strong>Ottodot</strong>, uniting curious young learners (ages 6–15), passionate educators, and engaged parents through structured feedback loops and role-isolated workflows.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/winandiaris4/ottodot-classloop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:bg-slate-100 transition-all hover:scale-105"
            >
              <GithubIcon className="w-4 h-4 text-slate-900" />
              View on GitHub (winandiaris4/ottodot-classloop)
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              Explore Course Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Platform Screenshot Showcase Mockup */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="rounded-3xl overflow-hidden border border-indigo-500/30 bg-slate-900/90 backdrop-blur-xl shadow-2xl shadow-indigo-950/80 group text-left">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/95 border-b border-indigo-950 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-3 text-indigo-300 text-[11px] font-sans font-medium">ottodot.winamus.com • Playful STEM Learning Hub</span>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Platform Preview
                </span>
              </div>
              <div className="overflow-hidden bg-slate-950">
                <Image
                  src="/images/screenshoot/landingpage.png"
                  alt="ClassLoop Landing Page Interface Preview"
                  width={962}
                  height={921}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Organic Wave Transition */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            className="relative block w-full h-12 sm:h-16 text-[#f8fafc]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,60 L1200,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="bg-[#f8fafc] text-slate-900 flex-1 relative z-20 -mt-1 pb-24 space-y-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pt-8">

          {/* 1. PURPOSE & VISION */}
          <section className="space-y-6">
            <div className="border-l-4 border-indigo-600 pl-4">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Pillar 1</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Purpose & Project Mission
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
                  🎯
                </div>
                <h3 className="text-lg font-black text-slate-900">The Problem in EdTech</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Most Learning Management Systems (LMS) are built for higher education or corporate compliance—dry, bureaucratic, and detached from how kids actually engage with technology. Parents are often left in the dark with fragmented report cards, while teachers spend hours on administrative overhead instead of mentoring.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-7 border border-emerald-200/90 shadow-sm bg-gradient-to-br from-white to-emerald-50/40 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
                  🚀
                </div>
                <h3 className="text-lg font-black text-slate-900">The ClassLoop Solution</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  ClassLoop reimagines the learning cycle as a <strong>continuous, gamified adventure</strong>. Abstract physics is taught through hands-on Roblox obstacle simulation, math logic through colorful 3D puzzles, and programming through real Python bots. Every homework submission triggers instant parent transparency and rubric feedback.
                </p>
              </div>
            </div>
          </section>

          {/* 2. OPERATIONAL MODULES & WORKFLOWS */}
          <section className="space-y-6">
            <div className="border-l-4 border-indigo-600 pl-4">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Pillar 2</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Current Features & Role Operations Guide
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                ClassLoop implements a strict 4-Role Isolation Architecture where each stakeholder receives a tailored experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student */}
              <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-slate-900">1. Student Portal</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <code className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">/student</code>
                        <span className="text-[11px] text-slate-400 font-medium">• student@demo.com</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screenshot Preview */}
                <div className="rounded-2xl overflow-hidden border border-indigo-100/80 bg-slate-50 shadow-inner group">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100/90 border-b border-slate-200 text-[10px] text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="ml-2 text-slate-600 font-medium">ottodot.winamus.com/student</span>
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Learner View</span>
                  </div>
                  <div className="overflow-hidden bg-slate-100">
                    <Image
                      src="/images/screenshoot/student-dashboard.png"
                      alt="ClassLoop Student Portal Dashboard"
                      width={1898}
                      height={869}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>

                <ul className="space-y-3 pt-1">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="font-bold text-slate-900">Dashboard Metrics: </strong>
                      Enrolled courses, graded tasks count, average grade %, and next scheduled live session.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="font-bold text-slate-900">Homework Portal (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">/student/homework</code>): </strong>
                      Filter tasks by status (To Do, Under Review, Graded) and track deadlines.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="font-bold text-slate-900">Submission Workspace: </strong>
                      Submit rich text responses, inspect rubric criteria, and read personalized teacher feedback.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="font-bold text-slate-900">Class Schedule (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">/student/schedule</code>): </strong>
                      Live timetable calendar with automated countdowns to interactive meetings.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Teacher */}
              <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                      <School className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-slate-900">2. Teacher Hub</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <code className="text-[11px] font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">/teacher</code>
                        <span className="text-[11px] text-slate-400 font-medium">• teacher@demo.com</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screenshot Preview */}
                <div className="rounded-2xl overflow-hidden border border-rose-100/80 bg-slate-50 shadow-inner group">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100/90 border-b border-slate-200 text-[10px] text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="ml-2 text-slate-600 font-medium">ottodot.winamus.com/teacher</span>
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Educator Hub</span>
                  </div>
                  <div className="overflow-hidden bg-slate-100">
                    <Image
                      src="/images/screenshoot/teacher-dashboard.png"
                      alt="ClassLoop Teacher Hub Classroom Management UI"
                      width={1904}
                      height={674}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>

                <ul className="space-y-3 pt-1">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="font-bold text-slate-900">Classroom Cohorts (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">/teacher/classes</code>): </strong>
                      Create cohorts, manage student rosters, and monitor live seat capacity.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="font-bold text-slate-900">Assignment Creator (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">/teacher/homework</code>): </strong>
                      Publish homework with deadlines, rich instructions, and customized score scales.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="font-bold text-slate-900">Split-View Grading Suite: </strong>
                      Inspect student submissions side-by-side, input numerical scores, and write formative feedback.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="font-bold text-slate-900">Class Timetable (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">/teacher/schedule</code>): </strong>
                      Overview of live sessions across all taught cohorts with direct meeting links.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Parent */}
              <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-slate-900">3. Parent Visibility</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <code className="text-[11px] font-mono font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">/parent</code>
                        <span className="text-[11px] text-slate-400 font-medium">• parent@demo.com</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screenshot Preview */}
                <div className="rounded-2xl overflow-hidden border border-amber-100/80 bg-slate-50 shadow-inner group">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100/90 border-b border-slate-200 text-[10px] text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="ml-2 text-slate-600 font-medium">ottodot.winamus.com/parent</span>
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Family Feed</span>
                  </div>
                  <div className="overflow-hidden bg-slate-100">
                    <Image
                      src="/images/screenshoot/parent-dashboard.png"
                      alt="ClassLoop Parent Portal Multi-Child Monitoring UI"
                      width={1904}
                      height={674}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>

                <ul className="space-y-3 pt-1">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="font-bold text-slate-900">Family Dashboard: </strong>
                      Aggregated completion percentage, average grades, and recent teacher remarks across all children.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="font-bold text-slate-900">Child Report Cards (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">/parent/children</code>): </strong>
                      Granular performance reports per child with complete assignment history and evaluation breakdown.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="font-bold text-slate-900">Consolidated Schedule (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">/parent/schedule</code>): </strong>
                      Single unified calendar tracking upcoming live classes across all enrolled siblings.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Admin */}
              <div className="bg-white rounded-3xl p-6 border border-teal-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-slate-900">4. Admin Operations</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <code className="text-[11px] font-mono font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">/admin</code>
                        <span className="text-[11px] text-slate-400 font-medium">• admin@demo.com</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screenshot Preview */}
                <div className="rounded-2xl overflow-hidden border border-teal-100/80 bg-slate-50 shadow-inner group">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100/90 border-b border-slate-200 text-[10px] text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="ml-2 text-slate-600 font-medium">ottodot.winamus.com/admin</span>
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">Admin Portal</span>
                  </div>
                  <div className="overflow-hidden bg-slate-100">
                    <Image
                      src="/images/screenshoot/admin-dashboard.png"
                      alt="ClassLoop Admin Operations & Analytics UI"
                      width={839}
                      height={933}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>

                <ul className="space-y-3 pt-1">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="font-bold text-slate-900">Executive Dashboard: </strong>
                      12-Month responsive enrollment trajectory charts (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">ResizeObserver</code>), KPI tiles, and system shortcuts.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="font-bold text-slate-900">User Management (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">/admin/users</code>): </strong>
                      Full user directory with role filters, masked UUIDs, and Parent-Student link modal.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="font-bold text-slate-900">Enrollment Manager (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">/admin/enrollments</code>): </strong>
                      Direct course enrollment and optimistic status toggles (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">active</code>, <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">completed</code>, <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">cancelled</code>, <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">expired</code>).
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="font-bold text-slate-900">Platform Reports (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">/admin/reports</code>): </strong>
                      Grading turnaround times and class completion metrics across cohorts.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. CURRENT PRODUCTION TECH STACK */}
          <section className="space-y-6">
            <div className="border-l-4 border-indigo-600 pl-4">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Pillar 3</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Current Technology Stack
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm text-center space-y-2">
                <FileCode2 className="w-8 h-8 text-indigo-600 mx-auto" />
                <div className="font-extrabold text-xs text-slate-900">Next.js 16</div>
                <div className="text-[10px] text-slate-500">Turbopack & App Router</div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm text-center space-y-2">
                <Layers className="w-8 h-8 text-cyan-500 mx-auto" />
                <div className="font-extrabold text-xs text-slate-900">React 19</div>
                <div className="text-[10px] text-slate-500">Server Actions & Optimistic UI</div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm text-center space-y-2">
                <Database className="w-8 h-8 text-emerald-500 mx-auto" />
                <div className="font-extrabold text-xs text-slate-900">Supabase Cloud</div>
                <div className="text-[10px] text-slate-500">PostgreSQL 14 + RLS</div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm text-center space-y-2">
                <Zap className="w-8 h-8 text-purple-600 mx-auto" />
                <div className="font-extrabold text-xs text-slate-900">Tailwind v4</div>
                <div className="text-[10px] text-slate-500">Soft Indigo System</div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm text-center space-y-2">
                <Server className="w-8 h-8 text-blue-600 mx-auto" />
                <div className="font-extrabold text-xs text-slate-900">Docker Standalone</div>
                <div className="text-[10px] text-slate-500">Alpine Multi-Stage Build</div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm text-center space-y-2">
                <Lock className="w-8 h-8 text-rose-500 mx-auto" />
                <div className="font-extrabold text-xs text-slate-900">Stripe Billing</div>
                <div className="text-[10px] text-slate-500">Checkout & Webhooks</div>
              </div>
            </div>
          </section>

          {/* 4. FUTURE EXPERT ROADMAP */}
          <section className="space-y-6">
            <div className="border-l-4 border-indigo-600 pl-4">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Pillar 4</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Future Expert Features Roadmap
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Planned capability upgrades across upcoming phases for core utility, communication, and realtime gamification.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
                <div className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black w-fit">
                  PHASE 1 • CORE UTILITY
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Supabase Storage & Attendance</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Native PDF/DOCX homework file attachments, inline document previewer, and 1-click live class meeting launcher (Zoom / Google Meet) with attendance status (`Present`, `Absent`, `Late`).
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
                <div className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black w-fit">
                  PHASE 2 • COMMUNICATION & REPORTS
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Teacher-Parent Feed & PDF Reports</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct formative feedback timeline for parents, plus automated server-side Student Report Card PDF generator with customized vector certificate designs.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
                <div className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black w-fit">
                  PHASE 3 • REALTIME & GAMIFICATION
                </div>
                <h3 className="font-extrabold text-base text-slate-900">WebSocket Alerts & XP Streaks</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time push notifications via Supabase Realtime WebSocket changes, learner weekly streak counters, and gamified achievement badges for milestones.
                </p>
              </div>
            </div>
          </section>

          {/* 5. ENTERPRISE SYSTEM DESIGN POTENTIAL */}
          <section className="space-y-6">
            <div className="border-l-4 border-indigo-600 pl-4">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Pillar 5</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Enterprise System Design & Scalability Potential
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Architectural strategies for scaling ClassLoop to 100,000+ concurrent learners across multiple schools and enterprise partners.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-indigo-600" />
                    Multi-Tenant School Partitioning
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Database schema tenant isolation (`tenant_id` / organization schemas) allowing white-label deployment for school districts, private academies, and franchise partners with custom subdomains (`school.ottodot.winamus.com`).
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Distributed Caching & Rate Limiting (Redis)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Integration of Redis / Upstash at the Edge layer for caching dashboard KPIs, catalog query results, and sliding-window rate limiting on sensitive auth endpoints.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-600" />
                    Event-Driven Worker Pipelines (BullMQ / Kafka)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Offloading heavy background tasks (batch email digest dispatch, PDF certificate rendering, automated AI homework transcription) to isolated background worker containers.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-rose-500" />
                    Observability & OpenTelemetry Tracing
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Distributed tracing with OpenTelemetry, Prometheus metrics collection, Sentry real-time exception tracking, and structured audit logs for SOC2 compliance readiness.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 6. GITHUB REPOSITORY & DEMO ACCESS */}
          <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Explore the Source Code
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                ClassLoop is built with clean architecture, strict TypeScript standards, and complete Document-as-Code development history.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="https://github.com/winandiaris4/ottodot-classloop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-slate-950 font-black text-sm shadow-xl hover:bg-slate-100 transition-all hover:scale-105"
                >
                  <GithubIcon className="w-4 h-4 text-slate-900" />
                  GitHub: winandiaris4/ottodot-classloop
                </a>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                >
                  Try 1-Click Demo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0d1532] text-slate-400 py-12 border-t border-indigo-950/80 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">ClassLoop</span>
              <span className="text-[10px] text-slate-400">by Ottodot • Playful STEM Education</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-300 font-medium">
            <Link href="/" className="hover:text-emerald-300 transition-colors">Home</Link>
            <Link href="/courses" className="hover:text-emerald-300 transition-colors">Courses</Link>
            <Link href="/about" className="hover:text-emerald-300 transition-colors">About</Link>
            <a href="/#pricing" className="hover:text-emerald-300 transition-colors">Pricing</a>
            <a
              href="https://github.com/winandiaris4/ottodot-classloop"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-300 transition-colors"
            >
              GitHub
            </a>
          </div>

          <div className="text-slate-500 text-center sm:text-right">
            © {new Date().getFullYear()} ClassLoop by Ottodot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

