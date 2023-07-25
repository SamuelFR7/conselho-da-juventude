'use client'
import React from 'react'
import { Button } from './ui/button'
import { Icons } from './icons'
import { confirmAttendeePresenceAction } from '@/app/_actions/attendees'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { catchError } from '@/lib/utils'
import { z } from 'zod'
import { attendeeSchema } from '@/lib/validations/attendees'

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
        router.push('/admin/')
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
        attendee.Subscription.payment.paymentStatus !== 'PAGO'
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
