'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { type z } from 'zod'

import { type changeAttendeeNameSchema } from '@/lib/validations/attendees'

export async function getAttendeeByIdAction(id: string) {
  const attendee = await db.attendee.findUnique({
    where: {
      id,
    },
    include: {
      field: true,
      Subscription: {
        select: {
          payment: {
            select: {
              paymentStatus: true,
            },
          },
        },
      },
    },
  })

  if (!attendee) {
    throw new Error('Attendee not found')
  }

  return attendee
}

export async function confirmAttendeePresenceAction(id: string) {
  const attendeeToConfirm = await db.attendee.findUnique({
    where: {
      id,
    },
    include: {
      field: true,
      Subscription: {
        select: {
          payment: {
            select: {
              paymentStatus: true,
            },
          },
        },
      },
    },
  })

  if (!attendeeToConfirm) {
    throw new Error('Attendee not found')
  }

  if (attendeeToConfirm.Subscription.payment.paymentStatus !== 'paid') {
    throw new Error('Não é possível confirmar uma inscrição não paga')
  }

  await db.attendee.update({
    where: {
      id,
    },
    data: {
      confirmedPresence: true,
    },
  })
  revalidatePath('/evento/admin/')
}

export async function getAllAttendeesAction(
  page: number,
  search?: string | null
) {
  const attendees = await db.attendee.findMany({
    include: {
      Subscription: {
        select: {
          createdAt: true,
          payment: {
            select: {
              paymentStatus: true,
            },
          },
        },
      },
      field: true,
    },
    skip: (page - 1) * 10,
    take: 10,
    where: {
      name: {
        contains: typeof search === 'string' ? search : undefined,
      },
    },
  })

  const count = await db.attendee.count()

  return { attendees, count }
}

export async function getPayedAndConfirmedAttendeesAction() {
  const attendees = await db.attendee.count({
    where: {
      Subscription: {
        payment: {
          paymentStatus: {
            equals: 'paid',
          },
        },
      },
      confirmedPresence: {
        equals: true,
      },
    },
  })

  return attendees
}

export async function getPayedAttendeesAction() {
  const attendees = await db.attendee.count({
    where: {
      Subscription: {
        payment: {
          paymentStatus: {
            equals: 'paid',
          },
        },
      },
      confirmedPresence: {
        equals: false,
      },
    },
  })

  return attendees
}

export async function getToPayAttendeesAction() {
  const attendees = await db.attendee.count({
    where: {
      Subscription: {
        payment: {
          paymentStatus: {
            equals: 'PENDENTE',
          },
        },
      },
    },
  })

  return attendees
}

export async function editAttendeeNameAction(
  input: z.infer<typeof changeAttendeeNameSchema> & {
    id: string
  }
) {
  const attendeeExists = await db.attendee.findUnique({
    where: {
      id: input.id,
    },
  })

  if (!attendeeExists) {
    throw new Error('Attendee not found')
  }

  await db.attendee.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
    },
  })

  revalidatePath('/evento/admin/')
}
