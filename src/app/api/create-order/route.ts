import { db } from '@/lib/db'
import { z } from 'zod'

const createSubscriptionValidator = z.object({
  subscriptions: z.array(
    z.object({
      name: z
        .string()
        .nonempty({ message: 'É preciso fornecer um nome' })
        .toUpperCase(),
      email: z
        .string()
        .email({ message: 'Digite um email válido' })
        .toLowerCase(),
      campo: z.string(),
    }),
  ),
  currentCartHash: z.string().nullish(),
})

export async function POST(req: Request) {
  const body = await req.json()

  const { subscriptions, currentCartHash } =
    createSubscriptionValidator.parse(body)

  if (!currentCartHash) {
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

  const createdOrder = await db.order.create({
    data: {
      cartId: currentCartHash,
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
