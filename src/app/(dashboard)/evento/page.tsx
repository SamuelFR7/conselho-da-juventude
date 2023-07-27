import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChooseQuantityForm } from '@/components/forms/choose-quantity-form'
import { Shell } from '@/components/shells/shell'

export default function Home() {
  return (
    <Shell>
      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p>
              Data: <span>23 e 24 de setembro</span>
            </p>
            <p>
              Horario: <span>08:00 às 22:00</span>
            </p>
            <ChooseQuantityForm />
          </div>
        </CardContent>
      </Card>
    </Shell>
  )
}
