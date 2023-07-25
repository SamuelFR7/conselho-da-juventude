import { getFields } from '@/app/_actions/fields'
import { CreateSubscriptionsForm } from '@/components/forms/create-subscripions-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Inscricao() {
  const fields = await getFields()

  return (
    <div className="w-full flex items-center justify-center py-4 px-4 md:px-0">
      <Card>
        <CardHeader>
          <CardTitle>
            Realizar Inscrições - Conselho da Juventude 2023
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreateSubscriptionsForm dataFields={fields} />
        </CardContent>
      </Card>
    </div>
  )
}
