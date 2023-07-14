import OrderConfirmedEmail from '@/components/emails/order-confirmed-email'
import { db } from '@/db'
import { env } from '@/env.mjs'
import { resend } from '@/lib/resend'
import { clerkClient } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const changeStatusSchema = z.object({
  order_number: z.string(),
  payment_status: z.string(),
})

export async function POST(req: Request, res: Response) {
  const body = await req.json()

  const { order_number, payment_status } = changeStatusSchema.parse(body)

  switch (payment_status) {
    case '1':
      await db.order.update({
        where: {
          orderNumber: order_number,
        },
        data: {
          paymentStatus: 'PENDENTE',
        },
      })
      break
    case '2': {
      const order = await db.order.update({
        where: {
          orderNumber: order_number,
        },
        data: {
          paymentStatus: 'PAGO',
        },
        include: {
          cart: {
            include: {
              subscriptions: {
                include: {
                  attendees: true,
                },
              },
            },
          },
        },
      })

      const user = await clerkClient.users.getUser(order.userId)

      const email =
        user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
          ?.emailAddress ?? null

      if (!email) {
        break
      }

      await resend.emails.send({
        from: env.EMAIL_FROM_ADDRESS,
        to: email,
        subject: 'Compra Efetivada - Conselho da Juventude 2023',
        react: OrderConfirmedEmail({
          customerName: user.firstName,
          subscriptions: order.cart.subscriptions,
        }),
      })

      await resend.emails.send({
        from: env.EMAIL_FROM_ADDRESS,
        to: email,
        subject: 'Ingressos do Evento - Conselho da Juventude 2023',
        html: '<p>Aqui estão seus ingressos para o Conselho da Juventude 2023:</p>',
      })

      break
    }
    case '3':
      await db.order.update({
        where: {
          orderNumber: order_number,
        },
        data: {
          paymentStatus: 'NEGADO',
        },
      })
      break
    case '4':
      await db.order.update({
        where: {
          orderNumber: order_number,
        },
        data: {
          paymentStatus: 'EXPIRADO',
        },
      })
      break
    case '5':
      await db.order.update({
        where: {
          orderNumber: order_number,
        },
        data: {
          paymentStatus: 'CANCELADO',
        },
      })
      break
    case '6':
      await db.order.update({
        where: {
          orderNumber: order_number,
        },
        data: {
          paymentStatus: 'NÃO FINALIZADO',
        },
      })
      break
    case '7':
      await db.order.update({
        where: {
          orderNumber: order_number,
        },
        data: {
          paymentStatus: 'AUTORIZADO',
        },
      })
      break
    case '8':
      await db.order.update({
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
