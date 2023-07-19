import { isClerkAPIResponseError } from '@clerk/nextjs'
import { type ClassValue, clsx } from 'clsx'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

export function formatPrice(price: number | string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(price))
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function catchClerkError(err: unknown) {
  const unknownErr = 'Algo deu errado, por favor tente novamente mais tarde'
  if (isClerkAPIResponseError(err)) {
    toast.error(err.errors[0]?.longMessage ?? unknownErr)
  } else {
    toast.error(unknownErr)
  }
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
  )
}
