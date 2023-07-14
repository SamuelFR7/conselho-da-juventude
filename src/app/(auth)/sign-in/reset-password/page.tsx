import { type Metadata } from 'next'
import { env } from '@/env.mjs'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ResetPasswordForm } from '@/components/forms/reset-password-form'
import { Shell } from '@/components/shells/shell'

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: 'Conselho da Juventude - Alterar senha',
  description: 'Digite seu email para alterar sua senha',
}

export default function ResetPasswordPage() {
  return (
    <Shell className="max-w-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Alterar senha</CardTitle>
          <CardDescription>
            Digite seu endereço de email e nós te enviaremos um código de
            verificação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </Shell>
  )
}
