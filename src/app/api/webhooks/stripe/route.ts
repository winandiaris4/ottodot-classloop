import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import { dispatchNotification } from '@/lib/actions/notification'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event: any

  if (stripe && webhookSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err: any) {
      console.error('[Stripe Webhook Signature Verification Failed]', err.message)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }
  } else {
    // If testing without signature or mock payload
    try {
      event = JSON.parse(body)
    } catch (err) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }
  }

  // Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const metadata = session.metadata || {}
    const { userId, classId, planId } = metadata

    if (userId && classId) {
      const supabase = await createClient()

      // Activate or create enrollment
      const { error: enrollError } = await supabase.from('enrollments').upsert(
        {
          student_id: userId,
          class_id: classId,
          plan_id: planId || null,
          status: 'active',
          stripe_session_id: session.id,
          stripe_payment_id: session.payment_intent as string || null,
        },
        { onConflict: 'student_id,class_id' }
      )

      if (enrollError) {
        console.error('[Webhook Enrollment Upsert Error]', enrollError)
      } else {
        // Send welcome notification
        await dispatchNotification({
          userId,
          title: 'Enrollment Confirmed! 🎉',
          body: 'Your payment was successful. You now have full access to class sessions and assignments.',
          type: 'system',
          metadata: { classId, planId, sessionId: session.id },
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
