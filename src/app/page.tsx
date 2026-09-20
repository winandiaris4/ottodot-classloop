import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CheckoutButton } from '@/components/landing/CheckoutButton'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sparkles,
  Rocket,
  GraduationCap,
  HeartHandshake,
  School,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Zap,
  Code2,
  Gamepad2,
  Atom,
  Users,
} from 'lucide-react'

export default async function LandingPage() {
  const supabase = await createClient()

  // Fetch active classes from database to showcase real courses
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center font-black text-white text-lg shadow-md shadow-indigo-500/20">
              🚀
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">ClassLoop</span>
              <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-widest leading-none">
                by Ottodot
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <a href="#courses" className="hover:text-white transition-colors">Courses</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#roles" className="hover:text-white transition-colors">Roles</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className: 'text-xs text-slate-300 hover:text-white hover:bg-slate-800',
              })}
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                size: 'sm',
                className: 'text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30',
              })}
            >
              Try Demo Accounts <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-40">
          <div className="w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-400/20 text-xs px-3 py-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
            Next-Gen Gamified STEM & Edtech Platform
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Empowering Kids Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-rose-400">Playful Science & Math</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            ClassLoop combines live interactive STEM classrooms, rich homework assignments, and total parent transparency into one cohesive edtech ecosystem for kids ages 8–15.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <a
              href="#pricing"
              className={buttonVariants({
                size: 'lg',
                className: 'w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-8 shadow-lg shadow-indigo-600/30',
              })}
            >
              Explore Plans & Enroll <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            <Link
              href="/login"
              className={buttonVariants({
                variant: 'outline',
                size: 'lg',
                className: 'w-full sm:w-auto border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-sm font-semibold',
              })}
            >
              <Zap className="w-4 h-4 mr-2 text-amber-400" /> 1-Click Demo Sandbox
            </Link>
          </div>

          {/* Quick Demo Credentials Bar */}
          <div className="pt-8 max-w-3xl mx-auto">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Demo Accounts Ready:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 font-mono">
                  student@demo.com
                </span>
                <span className="px-2.5 py-1 rounded-md bg-blue-950/80 border border-blue-800/60 text-blue-300 font-mono">
                  teacher@demo.com
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 font-mono">
                  parent@demo.com
                </span>
                <span className="px-2.5 py-1 rounded-md bg-rose-950/80 border border-rose-800/60 text-rose-300 font-mono">
                  admin@demo.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Showcase */}
      <section id="courses" className="py-20 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-400/20 text-xs">
              Interactive Curriculum
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Featured STEM & Coding Courses
            </h2>
            <p className="text-slate-400 text-sm">
              Gamified learning tracks that turn abstract math and physics concepts into playable adventures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all text-slate-100 flex flex-col justify-between">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-bold text-white">Roblox Physics & Velocity Explorers</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Ages 8–12 • Mechanics, Gravity, Collision & Lua Physics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Students build interactive obstacle courses while mastering Newton&apos;s laws, kinetic energy, and velocity vectors through hands-on simulation.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <span>Instructor: Dr. Maya Lin</span>
                  <Badge className="bg-indigo-900/60 text-indigo-300 border-indigo-700/60 text-[10px]">
                    Active Cohort
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all text-slate-100 flex flex-col justify-between">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                  <Atom className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-bold text-white">Quantum Kids: Math & Logic Puzzles</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Ages 9–14 • Probability, Spatial Reasoning & Logic
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Transform math anxiety into excitement with gamified logic gates, prime factor battles, and visual geometric proofs.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <span>Instructor: Dr. Maya Lin</span>
                  <Badge className="bg-purple-900/60 text-purple-300 border-purple-700/60 text-[10px]">
                    Active Cohort
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all text-slate-100 flex flex-col justify-between">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <Code2 className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-bold text-white">Python Game Creators & AI Lab</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Ages 11–15 • Python Syntax, Pygame & AI Principles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Write real Python code to create arcade mini-games, algorithmic bots, and interactive STEM visualizations.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <span>Instructor: Dr. Maya Lin</span>
                  <Badge className="bg-emerald-900/60 text-emerald-300 border-emerald-700/60 text-[10px]">
                    Enrolling Now
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Multi-Role 4-Pillar Features */}
      <section id="roles" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-400/20 text-xs">
              4-Role Isolation Architecture
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Designed for the Entire Learning Journey
            </h2>
            <p className="text-slate-400 text-sm">
              Each stakeholder enjoys an experience customized to their exact workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Student */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-indigo-900/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Student Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interactive homework submission workspace, real-time feedback inspection, and upcoming live session calendar.
              </p>
            </div>

            {/* Teacher */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-blue-900/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <School className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Teacher Hub</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Effortlessly create classes, publish rich homework assignments, and grade submissions with split-view evaluation.
              </p>
            </div>

            {/* Parent */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-emerald-900/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Parent Visibility</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track homework completion %, read teacher evaluation notes, and monitor family live class schedules.
              </p>
            </div>

            {/* Admin */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-rose-900/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Admin Operations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Platform user directory, parent-student link management, direct class enrollment, and academic reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section with Stripe Checkout */}
      <section id="pricing" className="py-20 bg-slate-900/80 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-400/20 text-xs">
              Simple & Transparent Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Invest in Your Child&apos;s STEM Future
            </h2>
            <p className="text-slate-400 text-sm">
              Full semester access with live teacher coaching and 100% money-back guarantee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Tier 1: Explorer */}
            <Card className="bg-slate-900 border-slate-800 text-slate-100 flex flex-col justify-between">
              <CardHeader>
                <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Starter</div>
                <CardTitle className="text-xl font-bold text-white">STEM Explorer</CardTitle>
                <div className="pt-2">
                  <span className="text-3xl font-black text-white">$49</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <CardDescription className="text-xs text-slate-400 pt-2">
                  Perfect for beginners exploring logic and coding.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    Access to 1 Active STEM Course
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    Interactive Homework Portal
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    Parent Progress Dashboard
                  </li>
                </ul>

                <div className="pt-4">
                  <CheckoutButton
                    planName="STEM Explorer"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tier 2: Pro Innovator (Popular) */}
            <Card className="bg-gradient-to-b from-indigo-950/60 to-slate-900 border-indigo-500 text-slate-100 flex flex-col justify-between relative shadow-xl shadow-indigo-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-indigo-600 text-white border-0 text-[10px] font-bold uppercase tracking-wider py-0.5 px-3">
                  Most Popular
                </Badge>
              </div>
              <CardHeader>
                <div className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Pro Tier</div>
                <CardTitle className="text-xl font-bold text-white">Pro Innovator</CardTitle>
                <div className="pt-2">
                  <span className="text-3xl font-black text-white">$89</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <CardDescription className="text-xs text-slate-300 pt-2">
                  Our flagship program with live interactive sessions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    Access to All STEM & Coding Courses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    Live Weekly Interactive Classrooms
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    Detailed Teacher Rubric Feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    Real-time Email & In-App Alerts
                  </li>
                </ul>

                <div className="pt-4">
                  <CheckoutButton
                    planName="Pro Innovator"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tier 3: Master Scholar */}
            <Card className="bg-slate-900 border-slate-800 text-slate-100 flex flex-col justify-between">
              <CardHeader>
                <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Master</div>
                <CardTitle className="text-xl font-bold text-white">Master Scholar</CardTitle>
                <div className="pt-2">
                  <span className="text-3xl font-black text-white">$149</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <CardDescription className="text-xs text-slate-400 pt-2">
                  Complete mastery track with 1-on-1 instructor mentoring.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    Unlimited Courses & Labs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    1-on-1 Monthly Mentorship Session
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    Priority Grading & Portfolio Reviews
                  </li>
                </ul>

                <div className="pt-4">
                  <CheckoutButton
                    planName="Master Scholar"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">ClassLoop</span>
            <span>• Portfolio Project for Ottodot Full Stack Engineer</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-slate-300">Sign In</Link>
            <a href="#courses" className="hover:text-slate-300">Courses</a>
            <a href="#pricing" className="hover:text-slate-300">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
