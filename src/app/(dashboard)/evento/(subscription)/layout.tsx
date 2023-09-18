import { redirect } from 'next/navigation'

import { subscriptionDeadlinePassed } from '@/lib/utils'

export default function EventoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (subscriptionDeadlinePassed()) {
    redirect('/conta/minhas-inscricoes')
  }

  return <main>{children}</main>
}
