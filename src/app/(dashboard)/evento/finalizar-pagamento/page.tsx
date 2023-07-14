'use client'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice } from '@/lib/utils'
import { useAuth } from '@clerk/nextjs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CieloCheckoutResponse } from '@/app/api/checkout/route'
import Link from 'next/link'

type CartInfo = {
  cart: {
    id: string
    createdAt: Date
    subscriptions: [
      {
        id: string
        cartId: string
        status: string
        participants: [
          {
            id: string
            name: string
            email: string
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
      const { data } = await axios.delete(`/api/subscription?id=${orderId}`)

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart_info'],
      })
    },
  })

  const {
    mutate: handlePayment,
    isLoading: isMutationLoading,
    isSuccess: isMutationSuccess,
  } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post<CieloCheckoutResponse>('/api/checkout')

      return data
    },
    onSuccess: (data) => {
      router.push(data.settings.checkoutUrl)
    },
  })

  if (!data || isLoading) {
    return (
      <div className="max-w-[600px] mx-auto mt-16">
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
                <tr>
                  <td>
                    <Skeleton className="h-5" />
                  </td>
                  <td>
                    <Skeleton className="h-5" />
                  </td>
                  <td>
                    <Skeleton className="h-5" />
                  </td>
                </tr>
              </tbody>
            </table>
            <Separator className="my-4" />
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">Total</h2>
              <Skeleton className="h-8 w-[100px]" />
            </div>

            <Skeleton className="h-10 w-full mt-2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const itemCount = data.cart.subscriptions.reduce(
    (total, item) => (total = total + item.participants.length),
    0,
  )

  return (
    <div className="max-w-[600px] mx-auto mt-16 ">
      <Card>
        <CardHeader>
          <CardTitle>Carrinho</CardTitle>
        </CardHeader>
        <CardContent>
          {itemCount === 0 ? (
            <>
              <div className="flex w-full items-center flex-col justify-center py-10 gap-2">
                <Icons.cart size={64} />
                <h2 className="text-center font-medium">
                  Seu carrinho está vazio
                </h2>
              </div>
              <Link className="w-full" href="/evento/">
                <Button className="w-full">Voltar para o início</Button>
              </Link>
            </>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th className="w-[400px] text-left">Produto</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.cart.subscriptions.map((subscription) => (
                    <tr key={subscription.id}>
                      <td>
                        Conselho da Juventude 2023 - x
                        {subscription.participants.length}
                      </td>
                      <td>
                        {formatPrice(subscription.participants.length * 100)}
                      </td>
                      <td>
                        <Button
                          onClick={() => mutate(subscription.id)}
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
                <h2 className="text-lg font-bold">
                  {formatPrice(itemCount * 100)}
                </h2>
              </div>
              <Button
                type="button"
                disabled={
                  isMutationLoading || isMutationSuccess || itemCount === 0
                }
                onClick={() =>
                  userId
                    ? handlePayment()
                    : router.push(
                        '/sign-in?redirect_url=/evento/finalizar-pagamento',
                      )
                }
                className="w-full mt-2"
              >
                {(isMutationLoading || isMutationSuccess) && (
                  <Icons.spinner
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Finalizar Pagamento
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
