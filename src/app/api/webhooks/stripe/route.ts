import { headers } from 'next/headers'
import { db } from '@/db'
import { env } from '@/env.mjs'
import { clerkClient } from '@clerk/nextjs'
import type Stripe from 'stripe'

import { resend } from '@/lib/resend'
import { stripe } from '@/lib/stripe'
import TicketsEmail from '@/components/emails/tickets-email'

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
        const payment = await db.payment.update({
          select: {
            Subscription: {
              include: {
                attendees: true,
              },
            },
          },
          where: {
            id: session.metadata.payment_id,
          },
          data: {
            paymentMethodType: session.payment_method_types[0],
            paymentStatus: session.payment_status,
          },
        })

        if (!payment.Subscription) break

        const user = await clerkClient.users.getUser(
          payment.Subscription.userId
        )

        const email =
          user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
            ?.emailAddress ?? null

        if (!email) {
          break
        }

        await resend.emails.send({
          from: env.EMAIL_FROM_ADDRESS,
          subject: 'Ingressos do Evento - Conselho da Juventude 2023',
          to: email,
          react: TicketsEmail({
            attendees: payment.Subscription.attendees,
          }),
        })
      }

      break
    }
    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object as Stripe.Checkout.Session

      if (!session.metadata?.payment_id) {
        throw new Error('Payment does not exists')
      }

      const payment = await db.payment.update({
        include: {
          Subscription: {
            include: {
              attendees: true,
            },
          },
        },
        where: {
          id: session.metadata.payment_id,
        },
        data: {
          paymentMethodType: session.payment_method_types[0],
          paymentStatus: session.payment_status,
        },
      })

      if (!payment.Subscription) break

      const user = await clerkClient.users.getUser(payment.Subscription.userId)

      const email =
        user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
          ?.emailAddress ?? null

      if (!email) {
        break
      }

      await resend.emails.send({
        from: env.EMAIL_FROM_ADDRESS,
        subject: 'Ingressos do Evento - Conselho da Juventude 2023',
        to: email,
        react: TicketsEmail({
          attendees: payment.Subscription.attendees,
        }),
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
