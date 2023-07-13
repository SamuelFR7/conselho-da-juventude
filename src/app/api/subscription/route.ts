import { db } from '@/db'
import { createParticipantsSchema } from '@/lib/validations/participant'
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
  const { participants } = createParticipantsSchema.parse(body)

  if (!cartId) {
    const cart = await db.cart.create({
      data: {
        subscriptions: {
          create: {
            status: 'PAGAMENTO_PENDENTE',
            participants: {
              create: participants,
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
      status: 'PAGAMENTO_PENDENTE',
      participants: {
        create: participants,
      },
    },
  })

  return new Response('Ok')
}
