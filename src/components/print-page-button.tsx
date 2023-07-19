'use client'

import { Button } from './ui/button'

export function PrintPageButton() {
  return <Button onClick={() => window.print()}>Imprimir</Button>
}
