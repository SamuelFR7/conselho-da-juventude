import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateSubscriptionsForm } from '@/components/forms/create-subscripions-form'
import { getFields } from '@/app/_actions/fields'

export default async function Inscricao() {
  const fields = await getFields()

  return (
    <div className="flex w-full items-center justify-center p-4 md:px-0">
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
