'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { createParticipantsSchema } from '@/lib/validations/participant'
import axios from 'axios'
import { z } from 'zod'
import { useSearchParams, useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import { Icons } from '../icons'

type Inputs = z.infer<typeof createParticipantsSchema>

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
    resolver: zodResolver(createParticipantsSchema),
    defaultValues: {
      participants: arrWithLength(),
    },
  })

  const { fields } = useFieldArray({
    control,
    name: 'participants',
    rules: {
      minLength: quantity,
    },
  })

  const { mutate, isSuccess, isLoading } = useMutation({
    mutationFn: async ({ participants }: Inputs) => {
      const payload = {
        participants,
        currentCartHash: localStorage.getItem('cart_hash'),
      }

      const { data } = await axios.post('/api/subscription/', payload)

      return data
    },
    onSuccess: () => {
      router.push('/evento/finalizar-pagamento')
    },
    onError: (error) => {
      error instanceof Error
        ? toast.error(error.message)
        : toast.error('Algo deu errado, tente novamente')
    },
  })

  const handleConfirm: SubmitHandler<Inputs> = async (data) => {
    mutate(data)
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(handleConfirm)}
    >
      {fields.map((field, index) => (
        <div key={field.id}>
          <h2 className="text-lg font-medium">Participante - {index + 1}</h2>
          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input {...register(`participants.${index}.name`)} />
              <p className="text-sm font-medium text-destructive">
                {errors.participants?.[index]?.name?.message}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...register(`participants.${index}.email`)} />
              <p className="text-sm font-medium text-destructive">
                {errors.participants?.[index]?.email?.message}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Campo</Label>
              <Input {...register(`participants.${index}.campo`)} />
              <p className="text-sm font-medium text-destructive">
                {errors.participants?.[index]?.campo?.message}
              </p>
            </div>
          </div>
          {index < quantity - 1 && <Separator />}
        </div>
      ))}
      <Button disabled={isLoading || isSuccess} type="submit">
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
