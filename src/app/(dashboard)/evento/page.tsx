import { ChooseQuantityForm } from '@/components/forms/choose-quantity-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="mt-8 max-w-[1400px] mx-auto items-center">
      <div className="grid grid-cols-4 gap-4">
        <Card className="col-span-3 max-h-[300px]">
          <CardHeader className="text-3xl font-bold">
            Conselho da Juventude 2023
          </CardHeader>
        </Card>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <p>
                  Data: <span>11 de setembro</span>
                </p>
                <p>
                  Horario: <span>19:00</span>
                </p>
                <Card>
                  <CardHeader>
                    <CardTitle>Realizar inscrição</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChooseQuantityForm />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}