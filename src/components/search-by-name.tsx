'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { useDebounce } from '@/hooks/use-debounce'

import { Input } from './ui/input'

export function SearchByName() {
  const [query, setQuery] = React.useState('')
  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    router.push(`${pathname}?page=1&search=${debouncedQuery}`)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  return (
    <Input
      placeholder="Pesquisar pelo nome"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}
