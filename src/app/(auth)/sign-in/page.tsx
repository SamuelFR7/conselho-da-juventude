import { type Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { env } from '@/env.mjs'
import { currentUser } from '@clerk/nextjs'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { OAuthSignIn } from '@/components/auth/oauth-signin'
import { SignInForm } from '@/components/forms/signin-form'
import { Shell } from '@/components/shells/shell'

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: 'Conselho da Juventude - Entrar',
  description: 'Entre com sua conta',
}

export default async function SignInPage() {
  const user = await currentUser()
  if (user) redirect('/evento/')

  return (
    <Shell className="max-w-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>
            Escolha seu método de login favorito
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <OAuthSignIn />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>
          <SignInForm />
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            <span className="mr-1 hidden sm:inline-block">
              Ainda não tem uma conta?
            </span>
            <Link
              aria-label="Registrar-se"
              href="/sign-up"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Registrar-se
            </Link>
          </div>
          <Link
            aria-label="Alterar senha"
            href="/sign-in/reset-password"
            className="text-sm text-primary underline-offset-4 transition-colors hover:underline"
          >
            Alterar senha
          </Link>
        </CardFooter>
      </Card>
    </Shell>
  )
}
