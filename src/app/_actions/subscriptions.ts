'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { env } from '@/env.mjs'
import { type CieloCheckoutResponse } from '@/types'
import { auth } from '@clerk/nextjs'
import { createId } from '@paralleldrive/cuid2'
import axios from 'axios'
import { type z } from 'zod'

import { resend } from '@/lib/resend'
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
          orderNumber: createId(),
          paymentStatus: 'PAGO',
          amount: data.attendees.length * 11000,
          paymentMethodType: 6,
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

  const { data } = await axios.post<CieloCheckoutResponse>(
    'https://cieloecommerce.cielo.com.br/api/public/v1/orders/',
    {
      SoftDescriptor: 'Cadesgo',
      Cart: {
        Items: [
          {
            Name: 'Ingresso Conselho da Juventude - 2023',
            UnitPrice: 11000,
            Quantity: inputs.length,
            Type: 'Digital',
          },
        ],
      },
      Shipping: {
        Type: 'WithoutShipping',
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        MerchantId: '41ab610a-e320-4d81-bb3b-0368023cd97b',
      },
    }
  )

  await db.subscription.create({
    data: {
      attendees: {
        create: inputs,
      },
      userId,
      payment: {
        create: {
          amount: inputs.length * 11000,
          orderNumber: data.orderNumber,
          paymentStatus: 'PENDENTE',
        },
      },
    },
  })

  return data
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
