'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { createAttendeesSchema } from '@/lib/validations/attendees'
import axios from 'axios'
import { z } from 'zod'
import { useSearchParams, useRouter } from 'next/navigation'
import React from 'react'
import { Icons } from '../icons'
import { catchError } from '@/lib/utils'

type Inputs = z.infer<typeof createAttendeesSchema>

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

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(createAttendeesSchema),
    defaultValues: {
      attendees: arrWithLength(),
    },
  })

  const { fields } = useFieldArray({
    control,
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
    <form className="flex flex-col " onSubmit={handleSubmit(handleConfirm)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <h2 className="text-lg font-medium">Participante - {index + 1}</h2>
          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input {...register(`attendees.${index}.name`)} />
              <p className="text-sm font-medium text-destructive">
                {errors.attendees?.[index]?.name?.message}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...register(`attendees.${index}.email`)} />
              <p className="text-sm font-medium text-destructive">
                {errors.attendees?.[index]?.email?.message}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Campo</Label>
              <Input {...register(`attendees.${index}.campo`)} />
              <p className="text-sm font-medium text-destructive">
                {errors.attendees?.[index]?.campo?.message}
              </p>
            </div>
          </div>
          {index < quantity - 1 && <Separator className="my-8" />}
        </div>
      ))}
      <Button className="mt-4" disabled={isLoading || isSuccess} type="submit">
        {(isLoading || isSuccess) && (
          <Icons.spinner
            className="mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        )}
        Confirmar
      </Button>
    </form>
  )
}
