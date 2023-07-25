import { PrismaClient } from '@prisma/client'

async function clearDb() {
  const prisma = new PrismaClient()

  await prisma.field.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.attendee.deleteMany()
  await prisma.subscription.deleteMany()
}

clearDb()
