'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { formAttendeesSchema } from '@/lib/validations/attendees'
import axios from 'axios'
import { z } from 'zod'
import { useSearchParams, useRouter } from 'next/navigation'
import React from 'react'
import { Icons } from '../icons'
import { catchError } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { fields as dataFields } from '@/lib/fields'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'

type Inputs = z.infer<typeof formAttendeesSchema>

export function AddToCartForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const quantity = Number(searchParams.get('quantity'))

  function arrWithLength() {
    const arr = []
    for (let i = 0; i < quantity; i++) {
      arr.push({})
    }

    return arr
  }

  const form = useForm<Inputs>({
    resolver: zodResolver(formAttendeesSchema),
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

  const { mutate, isSuccess, isLoading } = useMutation({
    mutationFn: async ({ attendees }: Inputs) => {
      const payload = {
        attendees,
        currentCartHash: localStorage.getItem('cart_hash'),
      }

      const { data } = await axios.post('/api/subscription/', payload)

      return data
    },
    onSuccess: () => {
      router.push('/evento/finalizar-pagamento')
    },
    onError: (error) => {
      catchError(error)
    },
  })

  const handleConfirm: SubmitHandler<Inputs> = async (data) => {
    mutate(data)
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col "
        onSubmit={(...args) => void form.handleSubmit(handleConfirm)(...args)}
      >
        {fields.map((field, index) => (
          <div key={field.id}>
            <h2 className="text-lg font-medium">Participante - {index + 1}</h2>
            <div className="flex flex-col gap-2">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input {...form.register(`attendees.${index}.name`)} />
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.attendees?.[index]?.name?.message}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input {...form.register(`attendees.${index}.email`)} />
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.attendees?.[index]?.email?.message}
                </p>
              </div>
              <div className="space-y-2">
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
                            <SelectItem
                              key={option.id}
                              value={String(option.id)}
                            >
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {index < quantity - 1 && <Separator className="my-8" />}
          </div>
        ))}
        <Button
          className="mt-4"
          disabled={isLoading || isSuccess}
          type="submit"
        >
          {(isLoading || isSuccess) && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Confirmar
        </Button>
      </form>
    </Form>
  )
}
