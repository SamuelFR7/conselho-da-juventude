import { userPrivateMetadataSchema } from '@/lib/validations/auth'
import { z } from 'zod'

export type UserRole = z.infer<typeof userPrivateMetadataSchema.shape.role>
