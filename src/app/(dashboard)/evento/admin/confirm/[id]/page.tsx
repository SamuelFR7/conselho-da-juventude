import {
  cn,
  handlePaymentStatus,
  paymentClassname,
  toTitleCase,
} from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ConfirmPresenceButton } from '@/components/confirm-presence-button'
import { Shell } from '@/components/shells/shell'
import { getAttendeeByIdAction } from '@/app/_actions/attendees'

interface IngressoIdPageProps {
  params: { id: string }
}

export default async function AdminConfirmPage({
  params,
}: IngressoIdPageProps) {
  const attendee = await getAttendeeByIdAction(params.id)

  return (
    <Shell>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Conselho da Juventude</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <h2 className="font-semibold">
              ID: <span className="font-normal">{params.id}</span>
            </h2>
            <h2 className="font-semibold">
              Participante:{' '}
              <span className="font-normal">{toTitleCase(attendee.name)}</span>
            </h2>
            <h2 className="font-semibold">
              Campo:{' '}
              <span className="font-normal">
                {toTitleCase(attendee.field.name)}
              </span>
            </h2>
            <h2 className="font-semibold">
              Email: <span className="font-normal">{attendee.email}</span>
            </h2>
            <h2 className="font-semibold">
              Status do Pagamento:{' '}
              <span
                className={cn(
                  'font-normal',
                  paymentClassname(attendee.Subscription.payment.paymentStatus)
                )}
              >
                {toTitleCase(
                  handlePaymentStatus(
                    attendee.Subscription.payment.paymentStatus
                  )
                )}
              </span>
            </h2>
            <h2 className="font-semibold">
              Presença confirmada:{' '}
              <span
                className={cn(
                  'font-normal',
                  attendee.confirmedPresence ? 'text-green-500' : 'text-red-500'
                )}
              >
                {attendee.confirmedPresence ? 'SIM' : 'NÃO'}
              </span>
            </h2>
          </div>
        </CardContent>
      </Card>
      <ConfirmPresenceButton attendee={attendee} />
    </Shell>
  )
}
