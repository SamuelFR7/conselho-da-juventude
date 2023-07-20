import { fields } from '@/lib/fields'
import { PrismaClient } from '@prisma/client'

function insertFields() {
  const prisma = new PrismaClient()

  fields.map(async (field) => {
    await prisma.field.create({
      data: {
        id: field.id,
        name: field.name,
      },
    })
  })
}

insertFields()
