import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

import { z } from 'zod'

const paymentValidator = z.object({
  quantity: z.number(),
})

export async function POST(req: Request, res: Response) {
  const body = await req.json()

  const { quantity } = paymentValidator.parse(body)

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: 'price_1NR5XWLjqztWQQjlW20IZb7v',
        quantity,
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:3000/`,
    cancel_url: `http://localhost:3000`,
  })

  return NextResponse.json(session.url)
}
