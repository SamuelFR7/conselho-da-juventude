import '@/styles/globals.css'

import React from 'react'
import { type Metadata } from 'next'
import { env } from '@/env.mjs'
import { ptBR } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'

import { fontSans } from '@/lib/fonts'
import { Toaster } from '@/components/ui/toaster'
import Providers from '@/components/providers'

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: 'Conselho da Juventude 2023',
  description: 'Realize sua isncrição para o Conselho da Juventude 2023',
  keywords: [
    'Juventude',
    'Cadesgo',
    'Assembleia',
    'Evento',
    'Inscrição',
    'Conselho da Juventude',
    'Missão',
    'Igreja',
    'Jovens',
    'Deus',
    'Cristão',
  ],
  authors: [
    {
      name: 'samuelfr7',
      url: 'https://github.com/samuelfr7',
    },
  ],
  creator: 'samuelfr7',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ClerkProvider localization={ptBR}>
        <html lang="pt-BR" suppressHydrationWarning>
          <body className={fontSans.variable}>
            <Providers>
              <main>{children}</main>
            </Providers>
            <Toaster />
          </body>
        </html>
      </ClerkProvider>
    </>
  )
}
