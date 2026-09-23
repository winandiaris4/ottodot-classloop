'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Home,
  GraduationCap,
  BookOpen,
  ClipboardList,
  BarChart2,
  MessageSquare,
  Sparkles,
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Courses', href: '/courses', icon: GraduationCap },
  { label: 'My Learning', href: '/student/dashboard', icon: BookOpen },
  { label: 'Assignments', href: '/student/homework', icon: ClipboardList },
  { label: 'Progress', href: '/parent/dashboard', icon: BarChart2 },
  { label: 'Messages', href: '#', icon: MessageSquare },
]

export function CoursesSidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={`w-64 bg-white border-r border-slate-200/80 p-4 flex flex-col justify-between shrink-0 min-h-screen ${className}`}>
      <div className="space-y-6">
        {/* Navigation List */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive =
              item.href === '/courses'
                ? pathname.startsWith('/courses')
                : item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Motivational Telescope Banner */}
      <div className="mt-8 rounded-3xl overflow-hidden bg-gradient-to-b from-amber-50/80 via-yellow-50 to-orange-50/60 border border-amber-200/70 p-4 relative text-center shadow-sm">
        <div className="w-full aspect-[4/3] relative mb-2 rounded-2xl overflow-hidden">
          <Image
            src="/images/banner-curiosity.jpg"
            alt="Curiosity today, skills tomorrow!"
            fill
            className="object-cover"
          />
        </div>
        <h4 className="font-extrabold text-xs text-slate-800 tracking-tight leading-tight">
          Curiosity today,
          <span className="block text-indigo-600 font-black">skills tomorrow!</span>
        </h4>
      </div>
    </aside>
  )
}

