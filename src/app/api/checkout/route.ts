import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { planId, classId, studentId } = body

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // 1. Fetch Plan Details
    let planName = 'STEM Explorer Subscription'
    let planPriceCents = 4900

    if (planId) {
      const { data: plan } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .maybeSingle()

      if (plan) {
        planName = plan.name
        planPriceCents = plan.price_cents
      }
    }

    const host = req.headers.get('origin') || 'http://localhost:3000'
    const successUrl = `${host}/enrollment/success?session_id={CHECKOUT_SESSION_ID}&plan_id=${planId || ''}&class_id=${classId || ''}`
    const cancelUrl = `${host}/enrollment/cancel`

    // 2. If Stripe is initialized with API key
    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `ClassLoop - ${planName}`,
                description: 'Full semester access to gamified live classes, homework portal & instructor feedback.',
              },
              unit_amount: planPriceCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          planId: planId || '',
          classId: classId || '',
          userId: user?.id || studentId || '',
        },
      })

      return NextResponse.json({ url: session.url })
    }

    // 3. Graceful Mock Mode (when Stripe secret key is not set in environment)
    const mockSessionId = `mock_chk_${Date.now()}`
    
    // Auto-fulfill enrollment if student/class provided
    if (user && classId) {
      await supabase.from('enrollments').upsert(
        {
          student_id: user.id,
          class_id: classId,
          plan_id: planId || null,
          status: 'active',
          stripe_session_id: mockSessionId,
        },
        { onConflict: 'student_id,class_id' }
      )
    }

    const mockSuccessUrl = `${host}/enrollment/success?session_id=${mockSessionId}&plan_id=${planId || ''}&class_id=${classId || ''}`
    return NextResponse.json({ url: mockSuccessUrl })
  } catch (error: any) {
    console.error('[Checkout API Error]', error)
    return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 })
  }
}

