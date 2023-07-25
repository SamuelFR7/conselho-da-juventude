import { auth, clerkClient } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

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
