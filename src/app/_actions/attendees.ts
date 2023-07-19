'use server'

import { db } from '@/db'

export async function getAttendeeById(id: string) {
  const attendee = await db.attendee.findUnique({
    where: {
      id,
    },
  })

  if (!attendee) {
    throw new Error('Attendee not found')
  }

  return attendee
}
