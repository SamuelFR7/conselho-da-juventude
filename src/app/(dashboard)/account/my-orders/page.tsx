import { getMyOrders } from '@/app/_actions/orders'
import { Shell } from '@/components/shells/shell'
import { TitleHeader } from '@/components/title-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default async function MyOrders() {
  const orders = await getMyOrders()

  return (
    <Shell>
      <TitleHeader
        title="Suas Compras"
        description="Acompanhe o status das suas compras"
      />
      {orders.length > 0 ? (
        <div className="flex gap-4 flex-wrap">
          {orders.map((order) => (
            <Card className="max-w-[430px] w-full" key={order.id}>
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
                        }).format(order.createdAt)}{' '}
                        as{' '}
                        {new Intl.DateTimeFormat('pt-BR', {
                          timeStyle: 'short',
                        }).format(order.createdAt)}
                      </td>
                    </tr>
                    <tr>
                      <td>Qtd de Ingressos:</td>
                      <td className="text-right font-medium">
                        {`${order.cart.subscriptions.reduce(
                          (total, item) =>
                            (total = total + item.participants.length),
                          0,
                        )} ${
                          order.cart.subscriptions.reduce(
                            (total, item) =>
                              (total = total + item.participants.length),
                            0,
                          ) > 1
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
                        }).format(
                          order.cart.subscriptions.reduce(
                            (total, item) =>
                              (total = total + item.participants.length),
                            0,
                          ) * 100,
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Status da Compra:</td>
                      <td
                        className={cn(
                          'text-right font-medium',
                          order.paymentStatus === 'PAGO'
                            ? 'text-green-500'
                            : '',
                          order.paymentStatus === 'NEGADO'
                            ? 'text-red-500'
                            : '',
                        )}
                      >
                        {order.paymentStatus}
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
