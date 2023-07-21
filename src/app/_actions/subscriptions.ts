'use server'

import { db } from '@/db'
import {
  createAttendeesSchema,
  formAttendeesSchema,
} from '@/lib/validations/attendees'
import { auth } from '@clerk/nextjs'
import { z } from 'zod'
import { createId } from '@paralleldrive/cuid2'
import { revalidatePath } from 'next/cache'
import { catchError } from '@/lib/utils'

export async function createManualSubscriptionsAction(
  input: z.infer<typeof formAttendeesSchema>,
) {
  const data = createAttendeesSchema.parse(input)

  const { userId } = auth()

  if (!userId) {
    throw new Error('User not found')
  }

  try {
    await db.order.create({
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
    revalidatePath('/admin/')
  } catch (error) {
    catchError(error)
  }
}
