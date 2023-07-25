import { z } from 'zod'

export const attendeeSchema = z.object({
  name: z
    .string()
    .nonempty({ message: 'É preciso fornecer um nome' })
    .toUpperCase(),
  email: z.string().email({ message: 'Digite um email válido' }).toLowerCase(),
  document: z.string().nonempty({ message: 'É preciso fornecer um CPF' }),
  shirtSize: z
    .string()
    .nonempty({ message: 'É preciso escolher o tamanho da camiseta' }),
  fieldId: z.string({ required_error: 'É preciso fornecer um campo' }),
})

export const formAttendeesSchema = z.object({
  attendees: z.array(attendeeSchema),
})
