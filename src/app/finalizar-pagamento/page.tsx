'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/utils'
import { useAuth } from '@clerk/nextjs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
  const { userId } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['cart_info'],
    queryFn: async () => {
      const { data } = await axios.get<CartInfo>(`/api/cart/`)

      return data
    },
    onError: () => {
      router.push('/')
    },
  })

  const { mutate } = useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await axios.delete(`/api/order?id=${orderId}`)

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart_info'],
      })
    },
  })

  const { mutate: handlePayment } = useMutation({
    mutationFn: async ({ quantity }: { quantity: number }) => {
      const payload: { quantity: number } = { quantity }

      const { data } = await axios.post<string>(
        '/api/checkout_sessions',
        payload,
      )

      return data
    },
    onSuccess: (data) => {
      router.push(data)
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
          <table>
            <thead>
              <tr>
                <th className="w-[400px] text-left">Produto</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.cart.orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    Conselho da Juventude 2023 - x{order.subscriptions.length}
                  </td>
                  <td>{formatPrice(order.subscriptions.length * 100)}</td>
                  <td>
                    <Button
                      onClick={() => mutate(order.id)}
                      variant="ghost"
                      size="icon"
                    >
                      <XIcon />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Separator className="my-4" />
          <div className="flex justify-between">
            <h2 className="text-lg font-bold">Total</h2>
            <h2 className="text-lg font-bold">{formatPrice(total)}</h2>
          </div>
          <Button
            type="button"
            onClick={() =>
              userId
                ? handlePayment({ quantity: total / 100 })
                : router.push('/sign-in?redirect_url=/finalizar-pagamento')
            }
            className="w-full mt-2"
          >
            Finalizar Pagamento
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
