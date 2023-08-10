import { headers } from 'next/headers'
import { db } from '@/db'
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
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      if (!session.metadata?.payment_id) {
        throw new Error('Payment does not exists')
      }

      if (session.payment_status === 'paid') {
        await db.payment.update({
          where: {
            id: session.metadata.payment_id,
          },
          data: {
            paymentMethodType: session.payment_method_types[0],
            paymentStatus: session.payment_status,
          },
        })
      }
      break
    }
    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object as Stripe.Checkout.Session

      if (!session.metadata?.payment_id) {
        throw new Error('Payment does not exists')
      }

      await db.payment.update({
        where: {
          id: session.metadata.payment_id,
        },
        data: {
          paymentMethodType: session.payment_method_types[0],
          paymentStatus: session.payment_status,
        },
      })

      break
    }
    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session

      if (!session.metadata?.payment_id) {
        throw new Error('Payment does not exists')
      }

      await db.payment.update({
        where: {
          id: session.metadata.payment_id,
        },
        data: {
          paymentMethodType: session.payment_method_types[0],
          paymentStatus: session.payment_status,
        },
      })
      break
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
