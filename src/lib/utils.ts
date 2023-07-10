import { type ClassValue, clsx } from 'clsx'
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
