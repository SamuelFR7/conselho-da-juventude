'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type CartInfo = {
  cart: {
    id: string
    expired: boolean
    orders: [
      {
        id: string
        cartId: string
        subscriptions: [
          {
            id: string
            name: string
            campo: string
          },
        ]
      },
    ]
  }
}

export default function FinishPayment() {
  const { data, isLoading } = useQuery({
    queryKey: ['cart_info'],
    queryFn: async () => {
      const { data } = await axios.get<CartInfo>(
        `/api/cart-info?id=${localStorage.getItem('cart_hash')}`,
      )

      return data
    },
  })

  if (!data || isLoading) {
    return <div>Loading...</div>
  }

  let total = 0
  data.cart.orders.map((order) => {
    return (total = total + order.subscriptions.length * 100)
  })

  return (
    <div className="max-w-[600px] mx-auto mt-16 ">
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <h2 className="text-lg font-medium mb-4">Produto</h2>
            <h2 className="text-lg font-medium mb-4">Subtotal</h2>
          </div>

          {data.cart.orders.map((order) => (
            <div key={order.id} className="flex justify-between">
              <span>Nome do Evento - x{order.subscriptions.length}</span>
              <span>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(order.subscriptions.length * 100)}
              </span>
            </div>
          ))}

          <Separator className="my-4" />
          <div className="flex justify-between">
            <h2 className="text-lg font-bold">Total</h2>
            <h2 className="text-lg font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(total)}
            </h2>
          </div>
          <Button className="w-full mt-2">Finalizar Pagamento</Button>
        </CardContent>
      </Card>
    </div>
  )
}
