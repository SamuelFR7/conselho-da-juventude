import React from 'react'
import { currentUser } from '@clerk/nextjs'

import { DashboardHeader } from '@/components/layouts/dashboard-header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  return (
    <div>
      <DashboardHeader user={user} />
      <main>{children}</main>
    </div>
  )
}
