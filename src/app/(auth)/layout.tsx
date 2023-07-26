import React from 'react'

import { DashboardHeader } from '@/components/layouts/dashboard-header'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <DashboardHeader user={null} />
      <main>{children}</main>
    </div>
  )
}
