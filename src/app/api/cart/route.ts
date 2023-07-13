import { db } from '@/db'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  const cookieStore = cookies()
  const cartId = cookieStore.get('cartId')?.value

  if (!cartId) return []

  const cart = await db.cart.findUnique({
    where: {
      id: cartId,
    },
    include: {
      subscriptions: {
        include: {
          participants: true,
        },
      },
    },
  })

  if (!cart) {
    cookieStore.set({
      name: 'cartId',
      value: '',
      expires: new Date(0),
    })
    return new Response('Cart does not exists', { status: 400 })
  }

  return new Response(
    JSON.stringify({
      cart,
    }),
  )
}
