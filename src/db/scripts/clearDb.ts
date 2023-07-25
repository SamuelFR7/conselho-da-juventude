import { PrismaClient } from '@prisma/client'

async function clearDb() {
  const prisma = new PrismaClient()

  await prisma.attendee.deleteMany()
  await prisma.field.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.payment.deleteMany()
}

clearDb()
