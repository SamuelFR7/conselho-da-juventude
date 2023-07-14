import { Shell } from '@/components/shells/shell'
import { TitleHeader } from '@/components/title-header'

export default function MyOrders() {
  return (
    <Shell>
      <TitleHeader
        title="Seus Pedidos"
        description="Acompanhe o status dos seus pedidos"
      />
    </Shell>
  )
}
