import { PrismaClient } from '@prisma/client'

async function clearDb() {
  const prisma = new PrismaClient()

  await prisma.order.deleteMany()
  await prisma.attendee.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.cart.deleteMany()
}

clearDb()
