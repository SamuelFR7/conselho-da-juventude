'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { env } from '@/env.mjs'
import { auth, clerkClient } from '@clerk/nextjs'
import { type z } from 'zod'

import { resend } from '@/lib/resend'
import { stripe } from '@/lib/stripe'
import { absoluteUrl } from '@/lib/utils'
import { type attendeeSchema } from '@/lib/validations/attendees'
import {
  createManualSubscriptionSchema,
  type formManualSubscriptionSchema,
} from '@/lib/validations/subscriptions'
import TicketsEmail from '@/components/emails/tickets-email'

export async function createManualSubscriptionsAction(
  input: z.infer<typeof formManualSubscriptionSchema>
) {
  const data = createManualSubscriptionSchema.parse(input)

  const { userId } = auth()

  if (!userId) {
    throw new Error('User not found')
  }

  const subscription = await db.subscription.create({
    select: {
      attendees: true,
    },
    data: {
      userId,
      attendees: {
        create: input.attendees,
      },
      payment: {
        create: {
          paymentStatus: 'paid',
          amount: data.attendees.length * 11000,
          paymentMethodType: 'pix',
        },
      },
    },
  })

  await resend.sendEmail({
    from: env.EMAIL_FROM_ADDRESS,
    to: data.emailToSend,
    subject: 'Ingressos do Evento - Conselho da Juventude 2023',
    react: TicketsEmail({
      attendees: subscription.attendees,
    }),
  })

  revalidatePath('/evento/admin/')
}

export async function createSubscriptionAction(
  inputs: z.infer<typeof attendeeSchema>[]
) {
  const { userId } = auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const subscription = await db.subscription.create({
    data: {
      attendees: {
        create: inputs,
      },
      userId,
      payment: {
        create: {
          amount: inputs.length * 11000,
          paymentStatus: 'PENDENTE',
        },
      },
    },
  })

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: absoluteUrl('/conta/minhas-inscricoes'),
    cancel_url: absoluteUrl('/conta/minhas-inscricoes'),
    mode: 'payment',
    line_items: [
      {
        price: env.STRIPE_TICKET_PRICE_ID,
        quantity: inputs.length,
      },
    ],
    metadata: {
      payment_id: subscription.paymentId,
    },
  })

  return stripeSession.url
}

export async function getMySubscriptions() {
  const { userId } = auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const subscriptions = await db.subscription.findMany({
    where: {
      userId,
    },
    include: {
      attendees: true,
      payment: true,
    },
  })

  return subscriptions
}

export async function deleteSubscriptionAction(id: string) {
  const { userId } = auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const user = await clerkClient.users.getUser(userId)

  if (!user) {
    throw new Error('Algo deu errado, tente novamente mais tarde')
  }

  if (user.privateMetadata.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const subscriptionToDelete = await db.attendee.findUnique({
    where: {
      id,
    },
    select: {
      subscriptionId: true,
    },
  })

  if (!subscriptionToDelete) {
    throw new Error('Algo deu errado, tente novamente mais tarde')
  }

  await db.subscription.delete({
    where: {
      id: subscriptionToDelete.subscriptionId,
    },
  })

  revalidatePath('/evento/admin')
}
