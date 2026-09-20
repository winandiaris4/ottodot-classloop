'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles, ArrowRight } from 'lucide-react'

interface CheckoutButtonProps {
  planId?: string
  classId?: string
  planName: string
  className?: string
  variant?: 'default' | 'outline' | 'secondary'
}

export function CheckoutButton({
  planId,
  classId,
  planName,
  className = '',
  variant = 'default',
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          classId,
        }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Failed to start checkout')
        setLoading(false)
      }
    } catch (err: any) {
      alert(err.message || 'Error initiating checkout')
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      variant={variant}
      className={`font-semibold text-xs transition-all ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Processing...
        </>
      ) : (
        <>
          Enroll in {planName} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </>
      )}
    </Button>
  )
}

