import { SubscribeForm } from '@/components/forms/subscribe-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Inscricao() {
  return (
    <div className="w-full flex items-center justify-center py-4">
      <Card>
        <CardHeader>
          <CardTitle>Realizar Inscrições para o Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <SubscribeForm />
        </CardContent>
      </Card>
    </div>
  )
}
