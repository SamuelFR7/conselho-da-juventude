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
      fieldId: z
        .string({
          required_error: 'É preciso fornecer um campo',
        })
        .transform((arg) => Number(arg)),
    }),
  ),
})

export const formAttendeesSchema = z.object({
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
      fieldId: z.string({
        required_error: 'É preciso fornecer um campo',
      }),
    }),
  ),
})
