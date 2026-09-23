import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { CheckoutButton } from '@/components/landing/CheckoutButton'
import { DemoAccountQuickLogin } from '@/components/landing/DemoAccountQuickLogin'
import {
  Sparkles,
  Rocket,
  GraduationCap,
  HeartHandshake,
  School,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Play,
  Heart,
  Code,
} from 'lucide-react'

export default async function LandingPage() {
  const supabase = await createClient()

  // Fetch active classes from database if available
  const { data: classes = [] } = await supabase
    .from('classes')
    .select('id, name, description, max_students, teacher:teacher_id(full_name)')
    .eq('status', 'active')
    .limit(3)

  // Fetch pricing plans from database
  const { data: plans = [] } = await supabase
    .from('plans')
    .select('*')
    .order('price_cents', { ascending: true })

  return (
    <div className="min-h-screen bg-[#0d1532] text-slate-900 flex flex-col selection:bg-emerald-400 selection:text-slate-900 font-sans">
      {/* Navigation Bar */}
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
            <a href="#courses" className="hover:text-emerald-300 transition-colors">Courses</a>
            <a href="#features" className="hover:text-emerald-300 transition-colors">Features</a>
            <a href="#roles" className="hover:text-emerald-300 transition-colors">Roles</a>
            <a href="#pricing" className="hover:text-emerald-300 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-200 hover:text-white px-3 py-2 rounded-full hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
            <a
              href="#demo-section"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 hover:shadow-emerald-400/30 transition-all hover:scale-105"
            >
              Try Demo Account <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-24 sm:pt-16 sm:pb-36 bg-[#0d1532] text-white">
        {/* Star Sparkle Particles & Ambient Lighting */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-12 left-1/4 w-2 h-2 rounded-full bg-amber-300 animate-ping opacity-75" />
          <div className="absolute top-1/3 left-10 w-3 h-3 rounded-full bg-yellow-200 blur-[1px] opacity-80" />
          <div className="absolute top-20 right-1/4 w-2.5 h-2.5 rounded-full bg-pink-300 opacity-80" />
          <div className="absolute bottom-1/3 right-12 w-2 h-2 rounded-full bg-cyan-300 opacity-70" />
          {/* Subtle cosmic glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-pink-500/20 rounded-full blur-[140px] -z-10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-900/60 border border-indigo-700/60 text-indigo-200 text-xs sm:text-sm font-semibold backdrop-blur-md">
                <span>STEM</span>
                <span className="text-indigo-400">•</span>
                <span>Coding</span>
                <span className="text-indigo-400">•</span>
                <span>Creative Thinking</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black tracking-tight leading-[1.08] text-white">
                Small Steps <br className="hidden sm:inline" />
                <span className="text-amber-300 font-black">Big Discoveries</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Interactive STEM and coding classes for curious kids. Real projects, expert teachers, and a joyful learning journey that grows with them.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#courses"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  Explore Courses <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#roles"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 backdrop-blur-md transition-all hover:scale-105"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-500/40 flex items-center justify-center text-white">
                    <Play className="w-3 h-3 fill-white ml-0.5" />
                  </div>
                  Watch Video
                </a>
              </div>
            </div>

            {/* Right Hero Visual Column (3D Astronaut Mascot) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-[420px] aspect-square">
                {/* Floating Code Pill Asset */}
                <div className="absolute -top-4 -left-4 z-20 px-3.5 py-1.5 rounded-2xl bg-indigo-950/90 border border-indigo-500/50 shadow-xl backdrop-blur-md flex items-center gap-1.5 text-cyan-300 font-mono text-sm font-bold animate-bounce duration-1000">
                  <Code className="w-4 h-4 text-cyan-400" />
                  <span>&lt;/&gt;</span>
                </div>

                {/* Main Hero Mascot Image */}
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-indigo-950/80 border-2 border-indigo-400/20 relative group">
                  <Image
                    src="/images/hero-astronaut.jpg"
                    alt="Ottodot Astronaut Learning Mascot"
                    width={500}
                    height={500}
                    priority
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Floating Badge on Bottom Right */}
                <div className="absolute -bottom-4 -right-4 z-20 px-4 py-2 rounded-2xl bg-white/95 text-slate-900 border border-slate-200 shadow-xl backdrop-blur-md flex items-center gap-2">
                  <span className="text-xl">🚀</span>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Gamified STEM</div>
                    <div className="text-xs font-black text-slate-900">Ages 6–15</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seamless Organic Wave Mask Divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            className="relative block w-full h-12 sm:h-20 lg:h-24 text-[#f8fafc]"
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

      {/* Main Bright Content Body */}
      <main className="bg-[#f8fafc] text-slate-900 flex-1 relative z-20 -mt-1 pb-24">
        {/* Floating Demo Credentials Hub (Overlaps Transition) */}
        <div id="demo-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -translate-y-6 sm:-translate-y-10">
          <div className="bg-white/95 backdrop-blur-xl border border-indigo-100 rounded-3xl p-5 sm:p-6 shadow-xl shadow-indigo-950/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
                  Instant 1-Click Role Sandbox:
                </h3>
                <span className="text-xs text-slate-500 hidden sm:inline">• Click any account to login immediately</span>
              </div>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 self-start sm:self-auto">
                No Password Required
              </span>
            </div>

            <DemoAccountQuickLogin />
          </div>
        </div>

        {/* Featured STEM & Coding Courses Section */}
        <section id="courses" className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/80">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Featured STEM & Coding Courses</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Playable Learning Adventures
                </h2>
                <p className="text-slate-500 text-sm max-w-xl">
                  Gamified tracks designed by expert educators that turn abstract math and coding into delightful hands-on projects.
                </p>
              </div>

              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 group self-start sm:self-auto"
              >
                View All Courses <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
              {/* Card 1: Roblox Physics */}
              <Link
                href="/courses/roblox-physics"
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-lg shadow-slate-100/80 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Thumbnail & Badges */}
                  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-indigo-50 border border-slate-100">
                    <Image
                      src="/images/course-roblox.jpg"
                      alt="Roblox Physics & Velocity Explorers"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-blue-500/90 text-white text-[11px] font-bold backdrop-blur-md shadow-sm">
                        Beginner
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label="Save to wishlist"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm flex items-center justify-center transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      Roblox Physics & Velocity Explorers
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Ages 8–12 • Physics, Math • 6 weeks
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Students construct interactive obstacle courses while mastering Newton&apos;s laws, kinetic energy, and velocity vectors through hands-on simulations.
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-slate-900">$49</span>
                    <span className="text-xs text-slate-400 font-semibold"> / month</span>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full bg-slate-900 group-hover:bg-indigo-600 text-white flex items-center justify-center shadow-md transition-all group-hover:scale-110 active:scale-95"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>

              {/* Card 2: Quantum Kids */}
              <Link
                href="/courses/quantum-kids-math"
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-lg shadow-slate-100/80 hover:shadow-xl hover:border-amber-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Thumbnail & Badges */}
                  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-amber-50 border border-slate-100">
                    <Image
                      src="/images/course-math.jpg"
                      alt="Quantum Kids: Math & Logic Puzzles"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-amber-500/90 text-white text-[11px] font-bold backdrop-blur-md shadow-sm">
                        Popular
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label="Save to wishlist"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm flex items-center justify-center transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors leading-snug">
                      Quantum Kids: Math & Logic Puzzles
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Ages 5–7 • Math, Logic • 6 weeks
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Transform math anxiety into excitement with gamified logic gates, prime factor battles, and visual geometric proofs through colorful puzzle mechanics.
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-slate-900">$49</span>
                    <span className="text-xs text-slate-400 font-semibold"> / month</span>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full bg-slate-900 group-hover:bg-amber-600 text-white flex items-center justify-center shadow-md transition-all group-hover:scale-110 active:scale-95"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>

              {/* Card 3: Python AI Lab */}
              <Link
                href="/courses/python-game-creators"
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-lg shadow-slate-100/80 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Thumbnail & Badges */}
                  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-emerald-50 border border-slate-100">
                    <Image
                      src="/images/course-python-ai.jpg"
                      alt="Python Game Creators & AI Lab"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold backdrop-blur-md shadow-sm">
                        New
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label="Save to wishlist"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm flex items-center justify-center transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug">
                      Python Game Creators & AI Lab
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Ages 11–15 • Coding, AI • 8 weeks
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Write real Python code to create arcade games, algorithmic bots, and interactive AI visualizations with live guidance from professional mentors.
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-slate-900">$49</span>
                    <span className="text-xs text-slate-400 font-semibold"> / month</span>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full bg-slate-900 group-hover:bg-emerald-600 text-white flex items-center justify-center shadow-md transition-all group-hover:scale-110 active:scale-95"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* 4-Role Architecture Feature Journey */}
        <section id="roles" className="py-16 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                <span>Unified Learning Ecosystem</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Designed for the Whole Family & Team
              </h2>
              <p className="text-slate-500 text-sm">
                Every user gets a tailored workspace designed for their unique role and goals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Student */}
              <div className="p-6 rounded-3xl bg-[#f8fafc] border border-indigo-100 hover:border-indigo-300 transition-all space-y-3.5 group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Student Portal</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Interactive homework workspace, live feedback review, class calendar, and gamified progress rewards.
                </p>
              </div>

              {/* Teacher */}
              <div className="p-6 rounded-3xl bg-[#f8fafc] border border-rose-100 hover:border-rose-300 transition-all space-y-3.5 group">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <School className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Teacher Hub</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Easily create cohorts, publish assignments, record attendance, and evaluate submissions with split-view grading.
                </p>
              </div>

              {/* Parent */}
              <div className="p-6 rounded-3xl bg-[#f8fafc] border border-amber-100 hover:border-amber-300 transition-all space-y-3.5 group">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Parent Transparency</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time completion tracking, qualitative teacher progress notes, and family live class schedules.
                </p>
              </div>

              {/* Admin */}
              <div className="p-6 rounded-3xl bg-[#f8fafc] border border-teal-100 hover:border-teal-300 transition-all space-y-3.5 group">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Admin Operations</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Centralized user directory, parent-student linking, enrollment lifecycles, and automated reporting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section with Stripe Checkout */}
        <section id="pricing" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <span>Flexible & Transparent</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Invest in Your Child&apos;s STEM Future
              </h2>
              <p className="text-slate-500 text-sm">
                Full cohort access with live teacher coaching and 100% money-back guarantee.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-5xl mx-auto items-stretch">
              {/* Tier 1: Explorer */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-md flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Starter</div>
                  <h3 className="text-2xl font-black text-slate-900">STEM Explorer</h3>
                  <div>
                    <span className="text-4xl font-black text-slate-900">$49</span>
                    <span className="text-xs text-slate-500 font-medium"> / month</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Ideal for young beginners exploring math logic and foundational physics.
                  </p>

                  <ul className="space-y-3 pt-3 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      Access to 1 Active STEM Course
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      Interactive Homework Portal
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      Parent Progress Dashboard
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <CheckoutButton
                    planName="STEM Explorer"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-full text-xs shadow-md"
                  />
                </div>
              </div>

              {/* Tier 2: Pro Innovator (Popular) */}
              <div className="bg-gradient-to-b from-indigo-50/80 to-white rounded-3xl p-7 border-2 border-indigo-500 shadow-xl shadow-indigo-100 flex flex-col justify-between relative">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-[11px] font-black uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
                    Most Popular
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="text-xs uppercase font-bold text-indigo-600 tracking-wider">Flagship Tier</div>
                  <h3 className="text-2xl font-black text-slate-900">Pro Innovator</h3>
                  <div>
                    <span className="text-4xl font-black text-slate-900">$89</span>
                    <span className="text-xs text-slate-500 font-medium"> / month</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Our most popular track with live weekly interactive classroom coaching.
                  </p>

                  <ul className="space-y-3 pt-3 text-xs text-slate-800 font-medium">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      Access to All STEM & Coding Courses
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      Live Weekly Interactive Classrooms
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      Detailed Teacher Rubric Feedback
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      Parent Progress Digest & Alerts
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <CheckoutButton
                    planName="Pro Innovator"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-full text-xs shadow-lg shadow-indigo-500/25"
                  />
                </div>
              </div>

              {/* Tier 3: Master Scholar */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-md flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Mastery</div>
                  <h3 className="text-2xl font-black text-slate-900">Master Scholar</h3>
                  <div>
                    <span className="text-4xl font-black text-slate-900">$149</span>
                    <span className="text-xs text-slate-500 font-medium"> / month</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Complete mastery track with dedicated 1-on-1 instructor mentorship.
                  </p>

                  <ul className="space-y-3 pt-3 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      Unlimited Courses & AI Labs
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      1-on-1 Monthly Mentorship Session
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      Priority Grading & Project Reviews
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <CheckoutButton
                    planName="Master Scholar"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-full text-xs shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Joyful Cohesive Footer */}
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
            <a href="#courses" className="hover:text-emerald-300 transition-colors">Courses</a>
            <a href="#roles" className="hover:text-emerald-300 transition-colors">Roles</a>
            <a href="#pricing" className="hover:text-emerald-300 transition-colors">Pricing</a>
            <Link href="/login" className="hover:text-emerald-300 transition-colors">Sign In</Link>
          </div>

          <div className="text-slate-500 text-center sm:text-right">
            © {new Date().getFullYear()} ClassLoop by Ottodot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
