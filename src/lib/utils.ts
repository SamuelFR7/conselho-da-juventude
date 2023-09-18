import { env } from '@/env.mjs'
import { isClerkAPIResponseError } from '@clerk/nextjs'
import { clsx, type ClassValue } from 'clsx'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

export function formatPrice(price: number | string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(price))
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
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
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  )
}

export function catchError(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issues) => {
      return issues.message
    })
    return toast(errors.join('\n'))
  } else if (err instanceof Error) {
    return toast(err.message)
  } else {
    return toast('Algo deu errado tente novamente mais tarde')
  }
}

export function handlePaymentStatus(status: string) {
  switch (status) {
    case 'paid':
      return 'CONFIRMADO'
    case 'unpaid':
      return 'NEGADO'
    default:
      return 'PENDENTE'
  }
}

export function paymentClassname(status: string) {
  switch (status) {
    case 'paid':
      return 'text-green-500'
    case 'unpaid':
      return 'text-red-500'
    default:
      return 'text-yellow-500'
  }
}

export function dateDifferenceFromToday(date: Date): number {
  const dateToCompare = dayjs(new Date())
  console.log(dateToCompare.diff(date, 'day'))
  return dateToCompare.diff(date, 'day')
}

export function subscriptionDeadlinePassed(): boolean {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  const deadline = dayjs('2023-09-18')
  return dayjs().isAfter(deadline, 'hour')
}
