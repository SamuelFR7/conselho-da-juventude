import { Button, buttonVariants } from '../ui/button'
import Link from 'next/link'

import { CartButton } from '../cart-button'
import { type User } from '@clerk/nextjs/dist/types/server'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Icons } from '../icons'
import { LogOutButton } from '../auth/logout-button'

interface DashboardHeaderProps {
  user: User | null
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const initials = `${user?.firstName?.charAt(0) ?? ''} ${
    user?.lastName?.charAt(0) ?? ''
  }`

  const email =
    user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? ''

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
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user?.imageUrl}
                        alt={user?.username ?? ''}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/account/">
                        <Icons.user
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                        Minha Conta
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/my-orders">
                        <Icons.order
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                        Meus Pedidos
                      </Link>
                    </DropdownMenuItem>
                    {user.privateMetadata.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/">
                          <Icons.admin
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                          />
                          Área do Administrador
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
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
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
