import { DashboardHeader } from '@/components/layouts/dashboard-header'
import { currentUser } from '@clerk/nextjs'
import React from 'react'

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
