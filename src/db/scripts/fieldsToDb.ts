import { PrismaClient } from '@prisma/client'

import { fields } from '@/lib/fields'

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
