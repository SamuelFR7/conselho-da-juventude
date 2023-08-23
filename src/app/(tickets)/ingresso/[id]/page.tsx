import { env } from '@/env.mjs'
import QRCode from 'react-qr-code'

import { handlePaymentStatus, toTitleCase } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PrintPageButton } from '@/components/print-page-button'
import { getAttendeeByIdAction } from '@/app/_actions/attendees'

interface IngressoIdPageProps {
  params: { id: string }
}

export default async function IngressoIdPage({ params }: IngressoIdPageProps) {
  const attendee = await getAttendeeByIdAction(params.id)

  return (
    <div className="flex w-full flex-col items-center gap-4 px-4 md:px-0">
      <Card className="mt-2 w-full max-w-[650px] p-4">
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
              Valor:{' '}
              <span className="font-normal">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(110)}
              </span>
            </h2>
            <h2 className="font-semibold">
              Local do Evento:{' '}
              <span className="font-normal">Rio Verde - GO</span>
            </h2>
            <h2 className="font-semibold">
              Data: <span className="font-normal">23 e 24 de setembro</span>
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
              <span className="font-normal">
                {toTitleCase(
                  handlePaymentStatus(
                    attendee.Subscription.payment.paymentStatus
                  )
                )}
              </span>
            </h2>
          </div>
          <div className="mt-10 flex w-full flex-col items-center gap-2">
            <h2 className="font-semibold">Digitalizar o QRCode:</h2>
            <QRCode
              size={200}
              bgColor="white"
              fgColor="black"
              value={`${env.NEXT_PUBLIC_APP_URL}/evento/admin/confirm/${attendee.id}`}
            />
          </div>
        </CardContent>
      </Card>
      <PrintPageButton />
    </div>
  )
}
