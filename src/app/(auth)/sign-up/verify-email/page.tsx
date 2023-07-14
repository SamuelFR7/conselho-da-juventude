import { type Metadata } from 'next'
import { env } from '@/env.mjs'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { VerifyEmailForm } from '@/components/forms/verify-email-form'
import { Shell } from '@/components/shells/shell'

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: 'Conselho da Juventude - Verificar Email',
  description: 'Verifique seu email para que você continue para o login',
}

export default function VerifyEmailPage() {
  return (
    <Shell className="max-w-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Verificar email</CardTitle>
          <CardDescription>
            Verifique seu endereço de email para completar a criação da sua
            conta
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <VerifyEmailForm />
        </CardContent>
      </Card>
    </Shell>
  )
}
