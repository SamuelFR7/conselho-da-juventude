'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { SignOutButton } from '@clerk/nextjs'

import { useMounted } from '@/hooks/use-mounted'

import { Icons } from '../icons'
import { Button } from '../ui/button'

export function LogOutButton() {
  const router = useRouter()
  const mounted = useMounted()
  const [isPending, startTransition] = React.useTransition()

  return (
    <>
      {mounted ? (
        <SignOutButton
          signOutCallback={() => {
            startTransition(() => {
              router.push(`${window.location.origin}/evento?redirect=false`)
            })
          }}
        >
          <Button
            aria-label="Sair"
            size="sm"
            variant="ghost"
            className="max-h-[20px] w-full justify-start px-1"
            disabled={isPending}
          >
            {isPending ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.logout className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Sair
          </Button>
        </SignOutButton>
      ) : (
        <></>
      )}
    </>
  )
}
