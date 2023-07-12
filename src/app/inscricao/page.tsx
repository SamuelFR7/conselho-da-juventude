import { AddToCartForm } from '@/components/forms/add-to-cart-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Inscricao() {
  return (
    <div className="w-full flex items-center justify-center py-4 px-4 md:px-0">
      <Card>
        <CardHeader>
          <CardTitle>
            Realizar Inscrições - Conselho da Juventude 2023
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddToCartForm />
        </CardContent>
      </Card>
    </div>
  )
}
