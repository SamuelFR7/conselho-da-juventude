import { NextResponse } from 'next/server'
import { db } from '@/db'
import { env } from '@/env.mjs'
import { clerkClient } from '@clerk/nextjs'
import { z } from 'zod'

import { resend } from '@/lib/resend'
import TicketsEmail from '@/components/emails/tickets-email'

const changeStatusSchema = z.object({
  order_number: z.string(),
  payment_status: z.string(),
})

export async function POST(req: Request, res: Response) {
  const body = await req.formData()

  const bodyJson = {
    order_number: body.get('order_number'),
    payment_status: body.get('payment_status'),
  }

  const { order_number, payment_status } = changeStatusSchema.parse(bodyJson)

  switch (payment_status) {
    case '1':
      await db.payment.update({
        where: {
          orderNumber: order_number,
        },
        data: {
          paymentStatus: 'PENDENTE',
        },
      })
      break
    case '2': {
      const payment = await db.payment.update({
        where: {
          orderNumber: order_number,
        },
        data: {
          paymentStatus: 'PAGO',
        },
        include: {
          Subscription: {
            include: {
              attendees: true,
            },
          },
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
        to: email,
        subject: 'Ingressos do Evento - Conselho da Juventude 2023',
        react: TicketsEmail({
          attendees: payment.Subscription.attendees,
        }),
      })

      break
    }
    case '3':
      await db.payment.update({
        where: {
          orderNumber: order_number,
        },
        data: {
          paymentStatus: 'NEGADO',
        },
      })
      break
    case '4':
      await db.payment.update({
        where: {
          orderNumber: order_number,
        },
        data: {
          paymentStatus: 'EXPIRADO',
        },
      })
      break
    case '5':
      await db.payment.update({
        where: {
          orderNumber: order_number,
        },
        data: {
          paymentStatus: 'CANCELADO',
        },
      })
      break
    case '6':
      await db.payment.update({
        where: {
          orderNumber: order_number,
        },
        data: {
          paymentStatus: 'NÃO FINALIZADO',
        },
      })
      break
    case '7':
      await db.payment.update({
        where: {
          orderNumber: order_number,
        },
        data: {
          paymentStatus: 'AUTORIZADO',
        },
      })
      break
    case '8':
      await db.payment.update({
        where: {
          orderNumber: order_number,
        },
        data: {
          paymentStatus: 'CHARGEBACK',
        },
      })
      break
  }

  return NextResponse.json('Ok')
}
