import '@/styles/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ptBR } from '@clerk/localizations'
import Providers from '@/components/providers'
import React from 'react'
import { fontSans } from '@/lib/fonts'
import { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import { env } from '@/env.mjs'

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

export default async function RootLayout({
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
