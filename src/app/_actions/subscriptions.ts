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
