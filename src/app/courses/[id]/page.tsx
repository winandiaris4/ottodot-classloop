import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCourseBySlug, COURSES_CATALOG } from '@/lib/courses-data'
import { CourseDetailView } from '@/components/courses/CourseDetailView'

interface CoursePageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return COURSES_CATALOG.map((course) => ({
    id: course.slug,
  }))
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { id } = await params
  const course = getCourseBySlug(id)

  if (!course) {
    return {
      title: 'Course Not Found | ClassLoop',
    }
  }

  return {
    title: `${course.title} | ClassLoop by Ottodot`,
    description: course.shortDescription,
  }
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { id } = await params
  const course = getCourseBySlug(id)

  if (!course) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col selection:bg-indigo-500 selection:text-white font-sans">
      <CourseDetailView course={course} />
    </div>
  )
}
