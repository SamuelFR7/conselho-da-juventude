'use server'

import { db } from '@/db'

export async function getFields() {
  const fields = await db.field.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  return fields
}
