import { buttonVariants } from '../ui/button'
import Link from 'next/link'

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { CartButton } from '../cart-button'

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <Link href="/evento/">
          <h1 className="font-bold md:text-2xl">
            Conselho da Juventude - 2023
          </h1>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <CartButton />
            <SignedIn>
              <UserButton afterSignOutUrl="/evento/" />
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
