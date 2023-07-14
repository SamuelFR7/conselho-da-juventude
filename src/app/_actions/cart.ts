'use server'

import { db } from '@/db'
import { cookies } from 'next/headers'

export async function getCartSubscriptionsAction() {
  const cartId = cookies().get('cartId')?.value

  if (!cartId) return []

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
    throw new Error('Cart not found')
  }

  return cart.subscriptions
}
