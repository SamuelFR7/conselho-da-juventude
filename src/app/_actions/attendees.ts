'use server'

import { db } from '@/db'

export async function getAttendeeById(id: string) {
  const attendee = await db.attendee.findUnique({
    where: {
      id,
    },
    include: {
      Subscription: {
        select: {
          Cart: {
            select: {
              Order: {
                select: {
                  paymentStatus: true,
                },
              },
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

export async function getAllAttendees(page: number) {
  const attendees = await db.attendee.findMany({
    include: {
      Subscription: {
        select: {
          Cart: {
            select: {
              Order: {
                select: {
                  paymentStatus: true,
                },
              },
            },
          },
        },
      },
    },
    skip: (page - 1) * 10,
    take: 10,
  })

  const count = await db.attendee.count()

  return { attendees, count }
}

export async function getPayedAndConfirmedAttendees() {
  const attendees = await db.attendee.count({
    where: {
      Subscription: {
        Cart: {
          Order: {
            paymentStatus: {
              equals: 'PAGO',
            },
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

export async function getPayedAttendees() {
  const attendees = await db.attendee.count({
    where: {
      Subscription: {
        Cart: {
          Order: {
            paymentStatus: {
              equals: 'PAGO',
            },
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

export async function getToPayAttendees() {
  const attendees = await db.attendee.count({
    where: {
      Subscription: {
        Cart: {
          Order: {
            paymentStatus: {
              equals: 'PENDENTE',
            },
          },
        },
      },
    },
  })

  return attendees
}
