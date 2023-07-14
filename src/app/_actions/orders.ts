'use server'

import { db } from '@/db'
import { currentUser } from '@clerk/nextjs'

export async function getMyOrders() {
  const user = await currentUser()

  if (!user) {
    throw new Error('You need to be logged in')
  }

  const orders = await db.order.findMany({
    where: {
      userId: user.id,
    },
    include: {
      cart: {
        include: {
          subscriptions: {
            include: {
              participants: true,
            },
          },
        },
      },
    },
  })

  return orders
}
