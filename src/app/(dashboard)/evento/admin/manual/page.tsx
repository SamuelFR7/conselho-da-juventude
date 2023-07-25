import { ChooseQuantityForm } from '@/components/forms/choose-quantity-form'
import { Shell } from '@/components/shells/shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ManualSubscriptionsChooseQuantityPage() {
  return (
    <Shell>
      <Card>
        <CardHeader>
          <CardTitle>Inscrições manuais</CardTitle>
        </CardHeader>
        <CardContent>
          <ChooseQuantityForm redirectUrl="/admin/manual/subscriptions" />
        </CardContent>
      </Card>
    </Shell>
  )
}
