'use client'
import { catchError } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams, useRouter } from 'next/navigation'
import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { Icons } from '../icons'
import { createManualSubscriptionsAction } from '@/app/_actions/subscriptions'
import { formManualSubscriptionSchema } from '@/lib/validations/subscriptions'
import { shirtSizes } from '@/lib/shirt-sizes'

type Inputs = z.infer<typeof formManualSubscriptionSchema>

interface CreateManualSubscriptionsFormProps {
  dataFields: {
    id: string
    name: string
  }[]
}

export function CreateManualSubscriptionsForm({
  dataFields,
}: CreateManualSubscriptionsFormProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const quantity = Number(searchParams.get('quantity'))

  function arrWithLength() {
    const arr = []
    for (let i = 0; i < quantity; i++) {
      arr.push({})
    }

    return arr
  }

  const form = useForm<Inputs>({
    resolver: zodResolver(formManualSubscriptionSchema),
    defaultValues: {
      attendees: arrWithLength(),
    },
  })

  const { fields } = useFieldArray({
    control: form.control,
    name: 'attendees',
    rules: {
      minLength: quantity,
    },
  })

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      try {
        await createManualSubscriptionsAction(data)
        router.push('/evento/admin/')
      } catch (error) {
        catchError(error)
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        {fields.map((field, index) => (
          <div key={field.id}>
            <h2 className="text-lg font-medium">Participante - {index + 1}</h2>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name={`attendees.${index}.name`}
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
              <FormField
                control={form.control}
                name={`attendees.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`attendees.${index}.document`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`attendees.${index}.fieldId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campo</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value: typeof field.value) =>
                        field.onChange(value)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dataFields.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`attendees.${index}.shirtSize`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamanho da Camiseta</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value: typeof field.value) =>
                        field.onChange(value)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shirtSizes.map((option, index) => (
                          <SelectItem key={index} value={option.value}>
                            {option.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {index < quantity - 1 && <Separator className="my-8" />}
          </div>
        ))}
        <Separator className="my-8" />
        <FormField
          control={form.control}
          name="emailToSend"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormDescription>
                Email para o envio dos QRCode de ingressos
              </FormDescription>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-4" disabled={isPending} type="submit">
          {isPending && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Confirmar
          <span className="sr-only">Confirmar</span>
        </Button>
      </form>
    </Form>
  )
}
