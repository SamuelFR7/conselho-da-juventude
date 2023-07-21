import { db } from '@/db'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  const cookieStore = cookies()
  const cartId = cookieStore.get('cartId')?.value

  if (!cartId)
    return new Response(
      JSON.stringify({
        cart: {
          subscriptions: [],
        },
      }),
    )

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

  if (!cart) {
    cookieStore.delete('cartId')
    return new Response(
      JSON.stringify({
        cart: {
          subscriptions: [],
        },
      }),
    )
  }

  return new Response(
    JSON.stringify({
      cart,
    }),
  )
}
