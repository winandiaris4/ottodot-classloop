import React from 'react'
import { Metadata } from 'next'
import { CoursesSidebar } from '@/components/courses/CoursesSidebar'
import { CourseCatalogView } from '@/components/courses/CourseCatalogView'

export const metadata: Metadata = {
  title: 'Explore Courses | ClassLoop by Ottodot',
  description: 'Gamified STEM and coding courses for curious kids ages 6–15.',
}

export default function CoursesCatalogPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row selection:bg-indigo-500 selection:text-white">
      {/* Learner Sidebar */}
      <CoursesSidebar className="hidden md:flex" />

      {/* Main Catalog View */}
      <CourseCatalogView />
    </div>
  )
}

