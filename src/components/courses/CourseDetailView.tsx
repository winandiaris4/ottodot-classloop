'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  BarChart3,
  Star,
  Laptop,
  Bell,
  Rocket,
} from 'lucide-react'
import { CourseItem } from '@/lib/courses-data'
import { CheckoutButton } from '@/components/landing/CheckoutButton'

interface CourseDetailViewProps {
  course: CourseItem
}

type TabType = 'overview' | 'curriculum' | 'requirements' | 'reviews'

export function CourseDetailView({ course }: CourseDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
      {/* Top Application Header matching detail page mockup */}
      <header className="h-20 bg-white border-b border-slate-200/80 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30">
        <Link href="/courses" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">ClassLoop</span>
            <span className="text-[10px] font-bold text-indigo-600 block tracking-wide">
              for Little Learners
            </span>
          </div>
        </Link>

        {/* Right Header Actions */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative w-10 h-10 rounded-full bg-slate-100/80 hover:bg-slate-200/70 flex items-center justify-center text-slate-600 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white" />
          </button>

          <Link href="/login" className="flex items-center gap-2.5 pl-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:ring-2 group-hover:ring-indigo-400 transition-all">
              AL
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Courses
          </Link>
        </div>

        {/* Hero Showcase Section (Two Columns) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Media Preview Column */}
            <div className="lg:col-span-6">
              <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md group">
                <Image
                  src={course.heroThumbnailUrl || course.thumbnailUrl}
                  alt={course.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark overlay for play contrast */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                {/* Circular Play Video Button */}
                <button
                  type="button"
                  onClick={() => setIsPlayingVideo(true)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-slate-900/90 text-white border-2 border-white/80 shadow-2xl flex items-center justify-center hover:scale-110 hover:bg-indigo-600 transition-all cursor-pointer"
                >
                  <Play className="w-7 h-7 fill-white ml-1" />
                </button>
              </div>
            </div>

            {/* Right Course Info & CTA Column */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  {course.level}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                  {course.ageRange}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {course.title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {course.longDescription}
              </p>

              {/* Price & Primary CTA */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
                <div>
                  <span className="text-3xl font-black text-slate-900">${course.priceMonthly}</span>
                  <span className="text-xs text-slate-500 font-semibold"> / month</span>
                </div>

                <CheckoutButton
                  planName={course.title}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-8 py-3.5 rounded-full text-sm shadow-lg shadow-indigo-600/25 hover:scale-105 active:scale-95 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Quick Value Metrics Strip */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">Live Sessions</div>
                <div className="text-[11px] text-slate-500">{course.sessionsPerWeek}x per week</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">Interactive Projects</div>
                <div className="text-[11px] text-slate-500">+ Weekly Assignments</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">Progress Reports</div>
                <div className="text-[11px] text-slate-500">For Parents & Kids</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Navigation Bar */}
        <div className="flex items-center gap-3 border-b border-slate-200">
          {(['overview', 'curriculum', 'requirements', 'reviews'] as TabType[]).map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-3 text-sm font-black capitalize transition-all cursor-pointer relative ${
                  isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            )
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: What You'll Learn */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">What You&apos;ll Learn</h2>
              <div className="space-y-3.5">
                {course.whatYoullLearn.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Instructor Bio */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-base">
                  {course.instructor.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">{course.instructor.name}</div>
                  <div className="text-xs text-slate-500">{course.instructor.title}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Perfect For Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">Perfect For</h3>
              <ul className="space-y-3">
                {course.perfectFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Curriculum */}
        {activeTab === 'curriculum' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-4">
              Weekly Syllabus ({course.curriculum.length} Weeks)
            </h2>
            <div className="space-y-3">
              {course.curriculum.map((week) => (
                <div
                  key={week.week}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4"
                >
                  <div className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-black text-xs shrink-0">
                    Week {week.week}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{week.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{week.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Requirements */}
        {activeTab === 'requirements' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Technical & Class Requirements</h2>
            <div className="space-y-3">
              {course.requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <Laptop className="w-5 h-5 text-indigo-600 shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Reviews */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
              <span className="font-black text-slate-900 text-base">4.9 / 5.0</span>
              <span className="text-xs text-slate-500">(48 Parent Reviews)</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Amanda K. (Parent of 10yo)</span>
                  <span className="text-[10px] text-slate-400">2 weeks ago</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  &ldquo;My son was completely hooked from lesson 1. He explained Newton&apos;s 3rd law to me using his Roblox rocket launcher! Highly recommended.&rdquo;
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Jason T. (Parent of 8yo)</span>
                  <span className="text-[10px] text-slate-400">1 month ago</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  &ldquo;Great balance between fun gaming and real STEM concepts. The teacher provides wonderful feedback on every assignment.&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Preview Modal */}
      {isPlayingVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl overflow-hidden max-w-2xl w-full border border-slate-700 shadow-2xl p-6 space-y-4 text-center">
            <div className="flex items-center justify-between text-white border-b border-slate-800 pb-3">
              <h3 className="font-black text-sm">{course.title} — Course Preview Trailer</h3>
              <button
                type="button"
                onClick={() => setIsPlayingVideo(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>
            <div className="aspect-video bg-black rounded-2xl flex items-center justify-center text-slate-400 text-xs">
              <div className="text-center space-y-2">
                <Play className="w-12 h-12 text-indigo-500 mx-auto animate-pulse" />
                <p>Interactive STEM Class Simulation Video</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
