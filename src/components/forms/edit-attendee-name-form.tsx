'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Attendee } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { type z } from 'zod'

import { catchError } from '@/lib/utils'
import { changeAttendeeNameSchema } from '@/lib/validations/attendees'
import { editAttendeeNameAction } from '@/app/_actions/attendees'

import { Icons } from '../icons'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'

type Inputs = z.infer<typeof changeAttendeeNameSchema>

interface EditAttendeeNameFormProps {
  attendee: Attendee
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function EditAttendeeNameForm({
  attendee,
  setIsOpen,
}: EditAttendeeNameFormProps) {
  const [isPending, startTransition] = React.useTransition()
  const form = useForm<Inputs>({
    resolver: zodResolver(changeAttendeeNameSchema),
    defaultValues: {
      name: attendee.name,
    },
  })

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      try {
        await editAttendeeNameAction({
          id: attendee.id,
          ...data,
        })

        toast.success('Nome alterado com sucesso')
        setIsOpen(false)
      } catch (error) {
        catchError(error)
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Salvar
          <span className="sr-only">Salvar</span>
        </Button>
      </form>
    </Form>
  )
}
