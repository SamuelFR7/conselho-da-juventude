import { db } from '@/lib/db'

export async function DELETE(req: Request) {
  const params = new URLSearchParams(new URL(req.url).search)

  await db.order.delete({
    where: {
      id: String(params.get('id')),
    },
  })

  return new Response('Ok')
}
