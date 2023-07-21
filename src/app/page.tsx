import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-zinc-50">
      <header className="flex items-center justify-between px-8 shadow-lg fixed top-0 left-0 bg-white w-full">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Logo da Cadesgo"
            width={45}
            height={45}
          />
          <h2 className="text-lg font-bold hidden md:block">
            Conselho da Juventude
          </h2>
        </div>
        <nav>
          <ul className="flex gap-8 py-4">
            <li>
              <Link className="hover:underline font-medium" href="/">
                Início
              </Link>
            </li>
            <li>
              <Link className="hover:underline font-medium" href="/evento/">
                Comprar
              </Link>
            </li>
          </ul>
        </nav>
        <div className="hidden md:block">
          <Link href="/sign-in">
            <Button className="text-black" variant="link">
              Log in
            </Button>
          </Link>
          <Link href="/evento/">
            <Button>Comprar Ingressos</Button>
          </Link>
        </div>
      </header>
      <Image
        src="/images/arte.png"
        width={1920}
        height={1080}
        className="w-full"
        alt="Arte de divulgação evento"
      />
      <section className="py-16 px-2 md:px-0">
        <Card className="max-w-[600px] mx-auto border-primary-gradient px-4 bg-zinc-50">
          <CardHeader>
            <CardTitle className="text-center font-extrabold text-4xl">
              INSCRIÇÃO PARA O EVENTO
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="w-full flex flex-col items-center gap-4 mt-6">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold">DATA DO EVENTO</h2>
              <span className="text-lg font-medium">23/09 e 24/09</span>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold">HORÁRIOS</h2>
              <div className="flex flex-col">
                <span className="font-medium">23/09 - 08H AS 22H</span>
                <span className=" font-medium">24/09 - 08H AS 22H</span>
              </div>
            </div>
            <h2 className="text-5xl font-bold">R$ 100,00</h2>
            <Link href="/evento/" className="w-full">
              <Button className="w-full">COMPRAR INGRESSO</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
      <footer className="bg-black w-full text-center text-white font-medium py-2">
        <h1>Todos os direitos reservados Conselho da Juventude 2023</h1>
      </footer>
    </div>
  )
}
