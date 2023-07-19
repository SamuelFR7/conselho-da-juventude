'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'

interface TablePaginationProps {
  currentPage: number
  dataCount: number
}

export function TablePagination({
  currentPage,
  dataCount,
}: TablePaginationProps) {
  const router = useRouter()
  const pathname = usePathname()

  function setPage(page: number) {
    router.push(`${pathname}?page=${page}`)
  }

  return (
    <div className="flex w-full items-center justify-between space-x-8 overflow-auto px-2">
      <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground"></div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[150px] items-center justify-center text-sm font-medium">
          Página {currentPage} de {Math.ceil(dataCount / 10)}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label="Go to first page"
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPage(1)}
            disabled={currentPage === 1}
          >
            <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to previous page"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to next page"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === Math.ceil(dataCount / 10)}
          >
            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to last page"
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPage(Math.ceil(dataCount / 10))}
            disabled={currentPage === Math.ceil(dataCount / 10)}
          >
            <DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
