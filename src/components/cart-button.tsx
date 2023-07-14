import Link from 'next/link'
import { Button } from './ui/button'
import { Icons } from './icons'
import { Badge } from './ui/badge'
import { getCartSubscriptionsAction } from '@/app/_actions/cart'

export type CartInfo = {
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

export async function CartButton() {
  const subscriptions = await getCartSubscriptionsAction()

  const itemCount = subscriptions.reduce(
    (total, item) => total + item.participants.length,
    0,
  )

  return (
    <Link href="/evento/finalizar-pagamento">
      <Button
        aria-label="Cart"
        variant="outline"
        size="icon"
        className="relative"
      >
        {itemCount > 0 && (
          <Badge
            variant="secondary"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-2"
          >
            {itemCount}
          </Badge>
        )}
        <Icons.cart className="h-4 w-4" aria-hidden="true" />
      </Button>
    </Link>
  )
}
