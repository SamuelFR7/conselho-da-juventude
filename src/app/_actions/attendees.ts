'use server'

import { db } from '@/db'
import { revalidatePath } from 'next/cache'

export async function getAttendeeByIdAction(id: string) {
  const attendee = await db.attendee.findUnique({
    where: {
      id,
    },
    include: {
      field: true,
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

export async function confirmAttendeePresenceAction(id: string) {
  const attendeeToConfirm = await db.attendee.findUnique({
    where: {
      id,
    },
    include: {
      field: true,
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

  if (!attendeeToConfirm) {
    throw new Error('Attendee not found')
  }

  if (attendeeToConfirm.Subscription.Cart.Order?.paymentStatus !== 'PAGO') {
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
  revalidatePath('/admin/')
}

export async function getAllAttendeesAction(page: number) {
  const attendees = await db.attendee.findMany({
    include: {
      field: true,
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
    where: {
      Subscription: {
        Cart: {
          Order: {
            isNot: null,
          },
        },
      },
    },
    skip: (page - 1) * 10,
    take: 10,
  })

  const count = await db.attendee.count({
    where: {
      Subscription: {
        Cart: {
          Order: {
            isNot: null,
          },
        },
      },
    },
  })

  return { attendees, count }
}

export async function getPayedAndConfirmedAttendeesAction() {
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

export async function getPayedAttendeesAction() {
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

export async function getToPayAttendeesAction() {
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
