import { type z } from 'zod'

import { type userPrivateMetadataSchema } from '@/lib/validations/auth'

export type UserRole = z.infer<typeof userPrivateMetadataSchema.shape.role>

export type CieloCheckoutResponse = {
  merchantId: string
  orderNumber: string
  softDescriptor: string
  settings: {
    checkoutUrl: string
    profile: string
    integrationType: string
    version: number
  }
}
