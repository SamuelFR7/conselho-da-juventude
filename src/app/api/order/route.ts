import { db } from '@/lib/db'
import { createSubscriptionValidator } from '@/lib/validators/subscription'
import { auth } from '@clerk/nextjs'
import * as dayjs from 'dayjs'

export async function DELETE(req: Request) {
  const { userId } = auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const params = new URLSearchParams(new URL(req.url).search)

  await db.order.delete({
    where: {
      id: String(params.get('id')),
    },
  })

  return new Response('Ok')
}

export async function POST(req: Request) {
  const { userId } = auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await req.json()

  const { subscriptions, currentCartHash } =
    createSubscriptionValidator.parse(body)

  if (!currentCartHash) {
    const createdCart = await db.cart.create({
      data: {
        expireDate: new Date(dayjs.default().add(30, 'minute').toString()),
      },
    })

    const createdOrder = await db.order.create({
      data: {
        cartId: createdCart.id,
        userId,
      },
    })
    subscriptions.map(async (sub) => {
      await db.subscription.create({
        data: {
          name: sub.name,
          orderId: createdOrder.id,
        },
      })
    })

    return new Response(
      JSON.stringify({
        cart_hash: createdCart.id,
      }),
    )
  }

  const createdOrder = await db.order.create({
    data: {
      cartId: currentCartHash,
      userId,
    },
  })

  subscriptions.map(async (sub) => {
    await db.subscription.create({
      data: {
        name: sub.name,
        orderId: createdOrder.id,
      },
    })
  })

  return new Response(
    JSON.stringify({
      cart_hash: currentCartHash,
    }),
  )
}
