import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { XCircle, ArrowLeft } from 'lucide-react'

export default function EnrollmentCancelPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <Card className="border-slate-200 shadow-md">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-500">
              <XCircle className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900">Checkout Cancelled</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              No charges were made to your account. You can return to pricing anytime.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <Link
              href="/"
              className={buttonVariants({
                className: 'w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs',
              })}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to Homepage & Pricing
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
