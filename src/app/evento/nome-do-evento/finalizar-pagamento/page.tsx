'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
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
    <div className="max-w-[1200px] mx-auto grid grid-cols-2 gap-4 mt-16 ">
      <Card className="max-h-[200px]">
        <CardHeader>
          <CardTitle>Fazer login</CardTitle>
          <CardContent>
            <Input />
          </CardContent>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          {data.cart.orders.map((order) => (
            <div className="grid grid-cols-2" key={order.id}>
              <div>
                <h2 className="text-lg font-medium mb-4">Produto</h2>
                <span>Nome do Evento - x{order.subscriptions.length}</span>
              </div>
              <div>
                <h2 className="text-lg font-medium mb-4">Subtotal</h2>
                <span>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(order.subscriptions.length * 100)}
                </span>
              </div>
            </div>
          ))}
          <div className="grid grid-cols-2 mt-8">
            <h2 className="text-lg font-bold">Total</h2>
            <h2 className="text-lg font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(total)}
            </h2>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
