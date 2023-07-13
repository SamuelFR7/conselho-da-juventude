import { db } from '@/db'
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
    case '2':
      await db.order.update({
        where: {
          orderNumber: order_number,
        },
        data: {
          paymentStatus: 'PAGO',
        },
      })
      break
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
