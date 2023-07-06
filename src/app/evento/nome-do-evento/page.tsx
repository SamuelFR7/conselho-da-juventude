import { BuyCard } from '@/app/components/buy-card'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'

export default function Home() {
  return (
    <main>
      <div className="mt-8 max-w-[1400px] mx-auto items-center">
        <div className="grid grid-cols-4 gap-4">
          <Card className="col-span-3">
            <CardHeader className="text-3xl font-bold">
              Evento de Nome...
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
                  <BuyCard />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
