import { db } from '@/db'
import { createSubscriptionSchema } from '@/lib/validations/subscription'
import { cookies } from 'next/headers'

export async function DELETE(req: Request) {
  const params = new URLSearchParams(new URL(req.url).search)

  await db.order.delete({
    where: {
      id: String(params.get('id')),
    },
  })

  return new Response('Ok')
}

export async function POST(req: Request) {
  const cookieStore = cookies()
  const cartId = cookieStore.get('cartId')?.value

  const body = await req.json()
  const { subscriptions } = createSubscriptionSchema.parse(body)

  if (!cartId) {
    console.log('aqui?')

    const cart = await db.cart.create({
      data: {
        orders: {
          create: {
            subscriptions: {
              create: subscriptions,
            },
          },
        },
      },
    })

    cookieStore.set('cartId', cart.id)

    return new Response('Ok')
  }

  await db.order.create({
    data: {
      cartId,
      subscriptions: {
        create: subscriptions,
      },
    },
  })

  return new Response('Ok')
}
