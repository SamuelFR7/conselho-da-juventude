import { z } from 'zod'

export const createParticipantsSchema = z.object({
  participants: z.array(
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
