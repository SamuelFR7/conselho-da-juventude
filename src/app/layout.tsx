import '@/styles/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ptBR } from '@clerk/localizations'
import Providers from '@/components/providers'
import React from 'react'
import { fontSans } from '@/lib/fonts'
import { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import { SiteHeader } from '@/components/layouts/site-header'

export const metadata: Metadata = {
  title: 'Conselho da Juventude 2023',
  description: 'Realize sua isncrição para o Conselho da Juventude 2023',
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
              <SiteHeader />
              <main>{children}</main>
            </Providers>
            <Toaster />
          </body>
        </html>
      </ClerkProvider>
    </>
  )
}
