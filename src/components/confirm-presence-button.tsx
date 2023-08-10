'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { type z } from 'zod'

import { catchError } from '@/lib/utils'
import { type attendeeSchema } from '@/lib/validations/attendees'
import { confirmAttendeePresenceAction } from '@/app/_actions/attendees'

import { Icons } from './icons'
import { Button } from './ui/button'

export function ConfirmPresenceButton({
  attendee,
}: {
  attendee: z.infer<typeof attendeeSchema> & {
    id: string
    confirmedPresence: boolean
    Subscription: {
      payment: {
        paymentStatus: string
      }
    }
  }
}) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  function confirmPresenceSubmit() {
    startTransition(async () => {
      try {
        await confirmAttendeePresenceAction(attendee.id)

        toast.success('Presença confirmada com sucesso')
        router.push('/evento/admin/')
      } catch (error) {
        catchError(error)
      }
    })
  }

  return (
    <Button
      disabled={
        isPending ||
        attendee.confirmedPresence ||
        attendee.Subscription.payment.paymentStatus !== 'paid'
      }
      onClick={confirmPresenceSubmit}
    >
      {isPending && (
        <Icons.spinner
          className="mr-2 h-4 w-4 animate-spin"
          aria-hidden="true"
        />
      )}
      {attendee.confirmedPresence
        ? 'Presença já confirmada'
        : 'Confirmar presença'}
    </Button>
  )
}
