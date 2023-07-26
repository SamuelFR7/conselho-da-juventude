import { getMySubscriptions } from '@/app/_actions/subscriptions'
import { Shell } from '@/components/shells/shell'
import { TitleHeader } from '@/components/title-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default async function MySubscriptions() {
  const subscriptions = await getMySubscriptions()

  return (
    <Shell>
      <TitleHeader
        title="Suas Inscrições"
        description="Acompanhe o status das suas inscrições"
      />
      {subscriptions.length > 0 ? (
        <div className="flex gap-4 flex-wrap">
          {subscriptions.map((subscription) => (
            <Card className="max-w-[430px] w-full" key={subscription.id}>
              <CardHeader>
                <CardTitle>Conselho da Juventude - 2023</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Data da Compra:</td>
                      <td className="text-right font-medium">
                        {new Intl.DateTimeFormat('pt-BR', {
                          dateStyle: 'medium',
                        }).format(subscription.createdAt)}{' '}
                        as{' '}
                        {new Intl.DateTimeFormat('pt-BR', {
                          timeStyle: 'short',
                        }).format(subscription.createdAt)}
                      </td>
                    </tr>
                    <tr>
                      <td>Qtd de Ingressos:</td>
                      <td className="text-right font-medium">
                        {`${subscription.attendees.length} ${
                          subscription.attendees.length > 1
                            ? 'ingressos'
                            : 'ingresso'
                        }`}
                      </td>
                    </tr>
                    <tr>
                      <td>Valor:</td>
                      <td className="text-right font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(subscription.attendees.length * 110)}
                      </td>
                    </tr>
                    <tr>
                      <td>Status da Compra:</td>
                      <td
                        className={cn(
                          'text-right font-medium',
                          subscription.payment.paymentStatus === 'PAGO'
                            ? 'text-green-500'
                            : '',
                          subscription.payment.paymentStatus === 'NEGADO'
                            ? 'text-red-500'
                            : '',
                        )}
                      >
                        {subscription.payment.paymentStatus}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <h1>Você ainda não fez nenhuma compra</h1>
      )}
    </Shell>
  )
}
