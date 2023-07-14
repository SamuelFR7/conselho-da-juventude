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
import { SignUpForm } from '@/components/forms/signup-form'
import { Shell } from '@/components/shells/shell'

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: 'Conselho da Juventude - Registrar',
  description: 'Registre-se para ter uma conta',
}

export default async function SignUpPage() {
  const user = await currentUser()
  if (user) redirect('/evento/')

  return (
    <Shell className="max-w-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Registrar</CardTitle>
          <CardDescription>
            Escolha seu método favorito para se registrar
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
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link
              aria-label="Sign in"
              href="/sign-in"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Entrar
            </Link>
          </div>
        </CardFooter>
      </Card>
    </Shell>
  )
}
