import { CreateManualSubscriptionsForm } from '@/components/forms/create-manual-subscriptions-form'
import { Shell } from '@/components/shells/shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ManualSubscriptionsPage() {
  return (
    <Shell>
      <Card>
        <CardHeader>
          <CardTitle>Inscrições</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateManualSubscriptionsForm />
        </CardContent>
      </Card>
    </Shell>
  )
}
