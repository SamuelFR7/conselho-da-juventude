import { DashboardHeader } from '@/components/layouts/dashboard-header'
import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <DashboardHeader />
      <main>{children}</main>
    </div>
  )
}
