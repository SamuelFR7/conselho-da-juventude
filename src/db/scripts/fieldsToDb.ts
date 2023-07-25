import { fields } from '@/lib/fields'
import { PrismaClient } from '@prisma/client'

function insertFields() {
  const prisma = new PrismaClient()

  fields.map(async (field) => {
    await prisma.field.create({
      data: {
        name: field.name,
      },
    })
  })
}

insertFields()
