import { z } from 'zod'

export const subscriptionValidator = z.object({
  subscriptions: z.array(
    z.object({
      name: z
        .string()
        .nonempty({ message: 'É preciso fornecer um nome' })
        .toUpperCase(),
      email: z
        .string()
        .email({ message: 'Digite um email válido' })
        .toLowerCase(),
      campo: z.string(),
    }),
  ),
})

export const createSubscriptionValidator = z.object({
  subscriptions: z.array(
    z.object({
      name: z
        .string()
        .nonempty({ message: 'É preciso fornecer um nome' })
        .toUpperCase(),
      email: z
        .string()
        .email({ message: 'Digite um email válido' })
        .toLowerCase(),
      campo: z.string(),
    }),
  ),
  currentCartHash: z.string().nullish(),
})
