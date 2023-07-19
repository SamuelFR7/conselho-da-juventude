import { getAttendeeById } from '@/app/_actions/attendees'
import { ConfirmPresenceButton } from '@/components/confirm-presence-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn, toTitleCase } from '@/lib/utils'

interface IngressoIdPageProps {
  params: { id: string }
}

export default async function AdminConfirmPage({
  params,
}: IngressoIdPageProps) {
  const attendee = await getAttendeeById(params.id)

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <Card className="mt-2 max-w-[650px] p-4 w-full">
        <CardHeader>
          <CardTitle className="text-center">Conselho da Juventude</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <h2 className="font-semibold">
              ID: <span className="font-normal">{params.id}</span>
            </h2>
            <h2 className="font-semibold">
              Participante:{' '}
              <span className="font-normal">{toTitleCase(attendee.name)}</span>
            </h2>
            <h2 className="font-semibold">
              Campo:{' '}
              <span className="font-normal">{toTitleCase(attendee.campo)}</span>
            </h2>
            <h2 className="font-semibold">
              Email: <span className="font-normal">{attendee.email}</span>
            </h2>
            <h2 className="font-semibold">
              Status do Pagamento:{' '}
              <span
                className={cn(
                  'font-normal',
                  attendee.Subscription?.Cart?.Order?.paymentStatus ===
                    'PENDENTE'
                    ? 'text-yellow-500'
                    : attendee.Subscription?.Cart?.Order?.paymentStatus ===
                      'PAGO'
                    ? 'text-green-500'
                    : '',
                )}
              >
                {toTitleCase(
                  attendee.Subscription?.Cart?.Order?.paymentStatus ??
                    'Não foi possível carregar o status',
                )}
              </span>
            </h2>
            <h2 className="font-semibold">
              Presença confirmada:{' '}
              <span
                className={cn(
                  'font-normal',
                  attendee.confirmedPresence
                    ? 'text-green-500'
                    : 'text-red-500',
                )}
              >
                {attendee.confirmedPresence ? 'SIM' : 'NÃO'}
              </span>
            </h2>
          </div>
        </CardContent>
      </Card>
      <ConfirmPresenceButton attendee={attendee} />
    </div>
  )
}