'use server'

import { db } from '@/db'
import { auth } from '@clerk/nextjs'
import { z } from 'zod'
import { createId } from '@paralleldrive/cuid2'
import { revalidatePath } from 'next/cache'
import { catchError } from '@/lib/utils'
import {
  createManualSubscriptionSchema,
  formManualSubscriptionSchema,
} from '@/lib/validations/subscriptions'
import { resend } from '@/lib/resend'
import { env } from '@/env.mjs'
import TicketsEmail from '@/components/emails/tickets-email'
import { attendeeSchema } from '@/lib/validations/attendees'
import axios from 'axios'

interface CieloCheckoutResponse {
  merchantId: string
  orderNumber: string
  softDescriptor: string
  settings: {
    checkoutUrl: string
    profile: string
    integrationType: string
    version: number
  }
}

export async function createManualSubscriptionsAction(
  input: z.infer<typeof formManualSubscriptionSchema>,
) {
  const data = createManualSubscriptionSchema.parse(input)

  const { userId } = auth()

  if (!userId) {
    throw new Error('User not found')
  }

  try {
    const order = await db.order.create({
      select: {
        cart: {
          select: {
            subscriptions: {
              select: {
                attendees: true,
              },
            },
          },
        },
      },
      data: {
        cart: {
          create: {
            subscriptions: {
              create: {
                attendees: {
                  create: data.attendees,
                },
              },
            },
          },
        },

        orderNumber: createId(),
        paymentStatus: 'PAGO',
        amount: data.attendees.length * 10000,
        paymentMethodType: 6,
        userId,
      },
    })

    const attendees = order.cart.subscriptions.flatMap((sub) => sub.attendees)

    await resend.sendEmail({
      from: env.EMAIL_FROM_ADDRESS,
      to: data.emailToSend,
      subject: 'Ingressos do Evento - Conselho da Juventude 2023',
      react: TicketsEmail({
        attendees,
      }),
    })

    revalidatePath('/admin/')
  } catch (error) {
    catchError(error)
  }
}

export async function createSubscriptionAction(
  inputs: z.infer<typeof attendeeSchema>[],
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
            UnitPrice: 10000,
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
    },
  )

  await db.subscription.create({
    data: {
      attendees: {
        create: inputs,
      },
      payment: {
        create: {
          amount: inputs.length * 10000,
          orderNumber: data.orderNumber,
          paymentStatus: 'PENDENTE',
          userId,
        },
      },
    },
  })

  return data
}
