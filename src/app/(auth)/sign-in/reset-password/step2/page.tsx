import { type Metadata } from 'next'
import { env } from '@/env.mjs'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ResetPasswordStep2Form } from '@/components/forms/reset-password-form-step2'
import { Shell } from '@/components/shells/shell'

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: 'Conselho da Juventude - Alterar senha',
  description: 'Digite sua nova senha e o código que enviamos no email',
}

export default function ResetPasswordStep2Page() {
  return (
    <Shell className="max-w-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Alterar senha</CardTitle>
          <CardDescription>
            Digite sua nova senha e o código de verificação que você recebeu em
            seu email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordStep2Form />
        </CardContent>
      </Card>
    </Shell>
  )
}
