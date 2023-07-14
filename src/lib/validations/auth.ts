import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().email({
    message: 'Digite um email válido',
  }),
  password: z
    .string()
    .min(8, {
      message: 'A senha tem que conter ao menos 8 caracteres',
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message:
        'A senha tem que conter ao menos 8 caracteres, um maiúsculo, um minúsculo, um número e um caractere especial',
    }),
})

export const verfifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: 'O código de verificação tem que conter 6 dígitos',
    })
    .max(6),
})

export const checkEmailSchema = z.object({
  email: authSchema.shape.email,
})

export const resetPasswordSchema = z
  .object({
    password: authSchema.shape.password,
    confirmPassword: authSchema.shape.password,
    code: verfifyEmailSchema.shape.code,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export const userPrivateMetadataSchema = z.object({
  role: z.enum(['user', 'admin']),
  stripePriceId: z.string().optional().nullable(),
  stripeSubscriptionId: z.string().optional().nullable(),
  stripeCustomerId: z.string().optional().nullable(),
  stripeCurrentPeriodEnd: z.string().optional().nullable(),
})
