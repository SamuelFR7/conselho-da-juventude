import { db } from '@/db'
import { auth } from '@clerk/nextjs'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export interface CieloCheckoutResponse {
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

export async function POST(req: Request, res: Response) {
  const { userId } = auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const cookieStore = cookies()

  const cartId = cookieStore.get('cartId')?.value

  if (!cartId)
    return new Response('You cannot pay without a cart', { status: 400 })

  const cart = await db.cart.findUnique({
    where: {
      id: cartId,
    },
    include: {
      subscriptions: {
        include: {
          attendees: true,
        },
      },
    },
  })

  if (!cart)
    return new Response('You cannot pay without a cart', { status: 400 })

  let totalAttendees = 0
  cart.subscriptions.map((subscription) => {
    return (totalAttendees = totalAttendees + subscription.attendees.length)
  })

  if (totalAttendees === 0)
    return new Response('You cannot pay with a empty cart', { status: 400 })

  try {
    const { data } = await axios.post<CieloCheckoutResponse>(
      'https://cieloecommerce.cielo.com.br/api/public/v1/orders/',
      {
        SoftDescriptor: 'Cadesgo',
        Cart: {
          Items: [
            {
              Name: 'Ingresso Conselho da Juventude - 2023',
              UnitPrice: 10000,
              Quantity: totalAttendees,
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

    cookieStore.set({
      name: 'cartId',
      value: '',
      expires: new Date(0),
    })

    await db.order.create({
      data: {
        orderNumber: data.orderNumber,
        amount: totalAttendees * 10000,
        paymentStatus: 'PENDENTE',
        userId,
        cart: {
          connect: {
            id: cart.id,
          },
        },
      },
    })

    return NextResponse.json(data)
  } catch (err) {
    return new Response('Algo deu errado', { status: 400 })
  }
}
