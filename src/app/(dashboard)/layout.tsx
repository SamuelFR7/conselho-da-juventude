import { DashboardHeader } from '@/components/layouts/dashboard-header'
import React from 'react'

export default function DashboardLayout({
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
