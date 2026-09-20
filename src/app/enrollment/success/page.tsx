import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { CheckCircle2, ArrowRight, BookOpen, ShieldCheck, Sparkles } from 'lucide-react'

export default async function EnrollmentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; plan_id?: string; class_id?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <Card className="border-emerald-200/80 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white text-center">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold">Enrollment Successful! 🎉</h1>
            <p className="text-xs text-emerald-100 mt-1">
              Welcome to the ClassLoop gamified STEM learning experience
            </p>
          </div>

          <CardContent className="p-6 space-y-5">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Confirmation Session:</span>
                <span className="font-mono text-slate-900 font-medium truncate max-w-[180px]">
                  {params.session_id || 'DEMO_ENROLL_OK'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Access Status:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Active & Verified
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-900">What happens next?</p>
              <ul className="space-y-1.5 list-disc pl-4">
                <li>Your student account has been enrolled in the live course.</li>
                <li>You can access homework prompts, submit solutions, and join live sessions.</li>
                <li>Parents linked to this student can track progress and grades in real-time.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                className={buttonVariants({
                  className: 'w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5',
                })}
              >
                Go to Student Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
              <Link
                href="/"
                className={buttonVariants({
                  variant: 'outline',
                  className: 'w-full text-xs text-slate-600',
                })}
              >
                Back to Homepage
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
