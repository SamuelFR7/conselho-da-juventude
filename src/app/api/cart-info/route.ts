import { db } from '@/lib/db'
import * as dayjs from 'dayjs'

export async function GET(req: Request) {
  const params = new URLSearchParams(new URL(req.url).search)

  const cart = await db.cart.findUnique({
    where: {
      id: String(params.get('id')),
    },
    include: {
      orders: {
        include: {
          subscriptions: true,
        },
      },
    },
  })

  if (!cart || cart.expireDate < new Date(dayjs.default().toString())) {
    return new Response('Cart does not exists', { status: 400 })
  }

  return new Response(
    JSON.stringify({
      cart,
    }),
  )
}
