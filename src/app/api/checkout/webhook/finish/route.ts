import { db } from '@/db'
import { env } from '@/env.mjs'
import { resend } from '@/lib/resend'
import { clerkClient } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const finishSchema = z.object({
  order_number: z.string(),
  customer_name: z.string(),
  customer_identity: z.string(),
  customer_email: z.string(),
  payment_status: z.string(),
  payment_method_type: z.string().transform((arg) => Number(arg)),
})

export async function POST(req: Request, res: Response) {
  const body = await req.text()

  const data = finishSchema.parse(JSON.parse(body))

  switch (data.payment_status) {
    case '1':
      await db.order.update({
        where: {
          orderNumber: data.order_number,
        },
        data: {
          paymentStatus: 'PENDENTE',
          customerEmail: data.customer_email,
          customerIdentity: data.customer_identity,
          customerName: data.customer_name,
          paymentMethodType: data.payment_method_type,
        },
      })
      break
    case '2': {
      const order = await db.order.update({
        where: {
          orderNumber: data.order_number,
          customerEmail: data.customer_email,
          customerIdentity: data.customer_identity,
          customerName: data.customer_name,
          paymentMethodType: data.payment_method_type,
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
          orderNumber: data.order_number,
        },
        data: {
          paymentStatus: 'NEGADO',
          customerEmail: data.customer_email,
          customerIdentity: data.customer_identity,
          customerName: data.customer_name,
          paymentMethodType: data.payment_method_type,
        },
      })
      break
    case '4':
      await db.order.update({
        where: {
          orderNumber: data.order_number,
        },
        data: {
          paymentStatus: 'EXPIRADO',
          customerEmail: data.customer_email,
          customerIdentity: data.customer_identity,
          customerName: data.customer_name,
          paymentMethodType: data.payment_method_type,
        },
      })
      break
    case '5':
      await db.order.update({
        where: {
          orderNumber: data.order_number,
        },
        data: {
          paymentStatus: 'CANCELADO',
          customerEmail: data.customer_email,
          customerIdentity: data.customer_identity,
          customerName: data.customer_name,
          paymentMethodType: data.payment_method_type,
        },
      })
      break
    case '6':
      await db.order.update({
        where: {
          orderNumber: data.order_number,
        },
        data: {
          paymentStatus: 'NÃO FINALIZADO',
          customerEmail: data.customer_email,
          customerIdentity: data.customer_identity,
          customerName: data.customer_name,
          paymentMethodType: data.payment_method_type,
        },
      })
      break
    case '7':
      await db.order.update({
        where: {
          orderNumber: data.order_number,
        },
        data: {
          paymentStatus: 'AUTORIZADO',
          customerEmail: data.customer_email,
          customerIdentity: data.customer_identity,
          customerName: data.customer_name,
          paymentMethodType: data.payment_method_type,
        },
      })
      break
    case '8':
      await db.order.update({
        where: {
          orderNumber: data.order_number,
        },
        data: {
          paymentStatus: 'CHARGEBACK',
          customerEmail: data.customer_email,
          customerIdentity: data.customer_identity,
          customerName: data.customer_name,
          paymentMethodType: data.payment_method_type,
        },
      })
      break
  }

  return NextResponse.json('Ok')
}
