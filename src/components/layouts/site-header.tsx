import { Button, buttonVariants } from '../ui/button'
import Link from 'next/link'

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Icons } from '../icons'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <h1 className="text-2xl font-bold">Conselho da Juventude - 2023</h1>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/finalizar-pagamento">
              <Button variant="ghost" size="icon">
                <Icons.cart />
              </Button>
            </Link>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in">
                <div
                  className={buttonVariants({
                    size: 'sm',
                  })}
                >
                  Entrar
                  <span className="sr-only">Entrar</span>
                </div>
              </Link>
            </SignedOut>
          </nav>
        </div>
      </div>
    </header>
  )
}
