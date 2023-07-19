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
    redirect('/')
  }

  const user = await clerkClient.users.getUser(userId)

  if (!user) {
    redirect('/')
  }

  if (user.privateMetadata.role !== 'admin') {
    redirect('/')
  }

  return <main>{children}</main>
}
