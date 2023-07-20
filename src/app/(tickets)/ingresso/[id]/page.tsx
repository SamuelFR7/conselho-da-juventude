import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toTitleCase } from '@/lib/utils'
import { env } from '@/env.mjs'
import { getAttendeeById } from '@/app/_actions/attendees'
import { PrintPageButton } from '@/components/print-page-button'
import QRCode from 'react-qr-code'

interface IngressoIdPageProps {
  params: { id: string }
}

export default async function IngressoIdPage({ params }: IngressoIdPageProps) {
  const attendee = await getAttendeeById(params.id)

  return (
    <div className="flex flex-col items-center gap-4 w-full px-4 md:px-0">
      <Card className="mt-2 max-w-[650px] p-4 w-full">
        <CardHeader>
          <CardTitle className="text-center">Conselho da Juventude</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <h2 className="font-semibold">
              ID: <span className="font-normal">{params.id}</span>
            </h2>
            <h2 className="font-semibold">
              Valor:{' '}
              <span className="font-normal">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(100)}
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
                  attendee.Subscription?.Cart?.Order?.paymentStatus ??
                    'Não foi possível carregar o status',
                )}
              </span>
            </h2>
          </div>
          <div className="flex flex-col items-center w-full justfiy-center mt-10 gap-2">
            <h2 className="font-semibold">Digitalizar o QRCode:</h2>
            <QRCode
              size={200}
              bgColor="white"
              fgColor="black"
              value={`${env.NEXT_PUBLIC_APP_URL}/admin/confirm/${attendee.id}`}
            />
          </div>
        </CardContent>
      </Card>
      <PrintPageButton />
    </div>
  )
}
