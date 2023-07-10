import { SiteHeader } from '@/components/layouts/site-header'
import React from 'react'

export default function LayoutEvent({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
    </>
  )
}
