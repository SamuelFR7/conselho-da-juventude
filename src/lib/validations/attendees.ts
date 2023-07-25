import { z } from 'zod'

export const attendeeSchema = z.object({
  name: z
    .string({ required_error: 'É preciso fornecer um nome' })
    .nonempty({ message: 'É preciso fornecer um nome' })
    .toUpperCase(),
  email: z
    .string({ required_error: 'É preciso fornecer um email' })
    .email({ message: 'Digite um email válido' })
    .toLowerCase(),
  document: z
    .string({ required_error: 'É preciso fornecer um CPF' })
    .nonempty({ message: 'É preciso fornecer um CPF' })
    .regex(new RegExp('[0-9]{3}.?[0-9]{3}.?[0-9]{3}-?[0-9]{2}'), {
      message: 'CPF Inválido',
    })
    .transform((arg) => arg.replace('.', ''))
    .transform((arg) => arg.replace('.', ''))
    .transform((arg) => arg.replace('-', '')),
  shirtSize: z
    .string({ required_error: 'É preciso escolher o tamanho da camiseta' })
    .nonempty({ message: 'É preciso escolher o tamanho da camiseta' }),
  fieldId: z.string({ required_error: 'É preciso fornecer um campo' }),
})

export const formAttendeesSchema = z.object({
  attendees: z.array(attendeeSchema),
})
