import { z } from 'zod'

export const createAttendeesSchema = z.object({
  attendees: z.array(
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
