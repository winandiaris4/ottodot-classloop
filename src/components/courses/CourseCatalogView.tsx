'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  Bell,
  Heart,
  ArrowRight,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { COURSES_CATALOG, CourseItem } from '@/lib/courses-data'

export function CourseCatalogView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price'>('popular')
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({})

  const categories = ['All', 'STEM', 'Coding', 'Math', 'Creative']

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredCourses = useMemo(() => {
    return COURSES_CATALOG.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === 'All' || course.category.toLowerCase() === selectedCategory.toLowerCase()

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
      {/* Top Application Bar */}
      <header className="h-20 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses, topics, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-100/80 border border-slate-200/80 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

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
      <div className="p-6 sm:p-8 space-y-6">
        {/* Page Title & Category Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              All Courses
            </h1>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white border border-slate-200/80 rounded-full px-4 py-1.5 pr-8 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
                >
                  <option value="popular">Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price">Price: Low to High</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-slate-800 text-lg">No courses found</h3>
            <p className="text-xs text-slate-500">Try adjusting your keyword search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
            {filteredCourses.map((course) => {
              const isFavorited = wishlist[course.id]
              const levelBadgeColor =
                course.level === 'Beginner'
                  ? 'bg-blue-500/90 text-white'
                  : course.level === 'Popular'
                  ? 'bg-amber-500/90 text-white'
                  : 'bg-emerald-500/90 text-white'

              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Thumbnail Container */}
                    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Level Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-sm ${levelBadgeColor}`}>
                          {course.level}
                        </span>
                      </div>

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        aria-label="Wishlist"
                        onClick={(e) => toggleWishlist(course.id, e)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full shadow-sm flex items-center justify-center transition-colors ${
                          isFavorited
                            ? 'bg-rose-50 text-rose-500'
                            : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Metadata & Title */}
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {course.ageRange} • {course.tags.join(', ')}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {course.shortDescription}
                    </p>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-black text-slate-900">${course.priceMonthly}</span>
                      <span className="text-xs text-slate-400 font-semibold"> / mo</span>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-slate-900 group-hover:bg-indigo-600 text-white flex items-center justify-center shadow-md transition-all group-hover:scale-110">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

