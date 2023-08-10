import { headers } from 'next/headers'
import { env } from '@/env.mjs'
import type Stripe from 'stripe'

import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') ?? ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    return new Response(
      `Webhook Error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      { status: 400 }
    )
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object

      console.log(paymentIntent)
    }
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (!session?.metadata?.userId) {
    return new Response(null, { status: 200 })
  }

  return new Response(null, { status: 200 })
}
