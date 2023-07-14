import { db } from '@/db'
import { env } from '@/env.mjs'
import { resend } from '@/lib/resend'
import { clerkClient } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const finishSchema = z.object({
  order_number: z.string(),
  amount: z.string(),
  customer_email: z.string(),
  payment_status: z.string(),
  test_transaction: z.boolean(),
})

export async function POST(req: Request, res: Response) {
  const body = await req.json()

  const { order_number, payment_status } = finishSchema.parse(body)

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
        subject: 'Inscrições Confirmadas - Conselho da Juventude 2023',
        html: '<p>Parabéns, sua compra foi aprovada e suas inscrições estão aprovadas para o Conselho da Juventude 2023</p>',
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
