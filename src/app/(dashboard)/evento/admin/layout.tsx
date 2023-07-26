import React from 'react'
import { redirect } from 'next/navigation'
import { auth, clerkClient } from '@clerk/nextjs'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth()

  if (!userId) {
    redirect('/evento')
  }

  const user = await clerkClient.users.getUser(userId)

  if (!user) {
    redirect('/evento')
  }

  if (user.privateMetadata.role !== 'admin') {
    redirect('/evento')
  }

  return <main>{children}</main>
}
