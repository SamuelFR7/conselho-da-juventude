import { db } from '@/db'
import { attendeeSchema } from '@/lib/validations/attendees'
import { cookies } from 'next/headers'

export async function DELETE(req: Request) {
  const params = new URLSearchParams(new URL(req.url).search)

  await db.subscription.delete({
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
  const { attendees } = attendeeSchema.parse(body)

  if (!cartId) {
    const cart = await db.cart.create({
      data: {
        subscriptions: {
          create: {
            attendees: {
              create: attendees,
            },
          },
        },
      },
    })

    cookieStore.set('cartId', cart.id)

    return new Response('Ok')
  }

  await db.subscription.create({
    data: {
      cartId,
      attendees: {
        create: attendees,
      },
    },
  })

  return new Response('Ok')
}
