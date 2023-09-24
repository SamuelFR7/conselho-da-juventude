import Image from 'next/image'
import Link from 'next/link'

import { subscriptionDeadlinePassed } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function Home() {
  return (
    <div className="bg-zinc-50">
      <header className="fixed left-0 top-0 flex w-full items-center justify-between bg-white px-8 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Logo da Cadesgo"
            width={45}
            height={45}
          />
          <h2 className="hidden text-lg font-bold md:block">
            Conselho da Juventude
          </h2>
        </div>
        <div className="hidden md:block">
          {subscriptionDeadlinePassed() ? (
            <Button asChild>
              <Link href="/conta/minhas-inscricoes">Minhas inscrições</Link>
            </Button>
          ) : (
            <Link href="/evento/">
              <Button>Comprar Ingressos</Button>
            </Link>
          )}
        </div>
      </header>
      <Image
        src="/images/arte.png"
        width={1920}
        height={1080}
        className="w-full"
        alt="Arte de divulgação evento"
      />
      <section className="px-2 py-16 md:px-0">
        <Card className="mx-auto max-w-[600px] bg-zinc-50 px-4">
          <CardHeader>
            {subscriptionDeadlinePassed() ? (
              <>
                <CardTitle className="text-center text-4xl font-extrabold text-red-500">
                  PRAZO DE INSCRIÇÃO ENCERRADO
                </CardTitle>
                <CardDescription className="text-center text-xl">
                  Você ainda pode visualizar suas inscrições já realizadas
                </CardDescription>
              </>
            ) : (
              <CardTitle className="text-center text-4xl font-extrabold">
                INSCRIÇÃO PARA O EVENTO
              </CardTitle>
            )}
          </CardHeader>
          <Separator />
          <CardContent className="mt-6 flex w-full flex-col items-center gap-4">
            {!subscriptionDeadlinePassed() && (
              <>
                <div className="flex flex-col items-center">
                  <h2 className="text-2xl font-bold">DATA DO EVENTO</h2>
                  <span className="text-lg font-medium">23/09 e 24/09</span>
                </div>
                <div className="flex flex-col items-center">
                  <h2 className="text-2xl font-bold">HORÁRIOS</h2>
                  <div className="flex flex-col">
                    <span className="font-medium">23/09 - 08H AS 22H</span>
                    <span className=" font-medium">24/09 - 08H AS 12H</span>
                  </div>
                </div>
                <h2 className="text-5xl font-bold">R$ 110,00</h2>
              </>
            )}
            {subscriptionDeadlinePassed() ? (
              <Button asChild className="w-full">
                <Link href="/conta/minhas-inscricoes">Ver suas inscrições</Link>
              </Button>
            ) : (
              <Link href="/evento/" className="w-full">
                <Button className="w-full">COMPRAR INGRESSO</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </section>
      <footer className="w-full bg-black py-2 text-center font-medium text-white">
        <h1>Todos os direitos reservados Conselho da Juventude 2023</h1>
      </footer>
    </div>
  )
}
