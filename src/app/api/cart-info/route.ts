import { db } from '@/lib/db'

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

  return new Response(
    JSON.stringify({
      cart,
    }),
  )
}
