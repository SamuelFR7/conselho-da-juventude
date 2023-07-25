import { getFields } from '@/app/_actions/fields'
import { CreateManualSubscriptionsForm } from '@/components/forms/create-manual-subscriptions-form'
import { Shell } from '@/components/shells/shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ManualSubscriptionsPage() {
  const fields = await getFields()

  return (
    <Shell>
      <Card>
        <CardHeader>
          <CardTitle>Inscrições</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateManualSubscriptionsForm dataFields={fields} />
        </CardContent>
      </Card>
    </Shell>
  )
}
