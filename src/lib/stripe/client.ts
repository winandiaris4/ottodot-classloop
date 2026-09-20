import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2026-02-25.acacia' as any,
      appInfo: {
        name: 'ClassLoop Ottodot Platform',
        version: '0.1.0',
      },
    })
  : null
