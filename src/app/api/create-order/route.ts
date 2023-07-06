import { db } from '@/lib/db'
import { subscriptionValidator } from '@/lib/validators/subscription'

export async function POST(req: Request) {
  const body = await req.json()

  const { subscriptions } = subscriptionValidator.parse(body)

  const createdCart = await db.cart.create({
    data: {},
  })
  const createdOrder = await db.order.create({
    data: {
      cartId: createdCart.id,
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
