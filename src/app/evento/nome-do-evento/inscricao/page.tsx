'use client'
import { Button } from '@/app/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Separator } from '@/app/components/ui/separator'
import { subscriptionValidator } from '@/lib/validators/subscription'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

type FormData = z.infer<typeof subscriptionValidator>

export default function Inscricao() {
  const searchParams = useSearchParams()

  const quantity = searchParams.get('quantity')
  function arrWithLength() {
    const arr = []
    for (let i = 0; i < Number(quantity); i++) {
      arr.push({})
    }

    return arr
  }

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(subscriptionValidator),
    defaultValues: {
      subscriptions: arrWithLength(),
    },
  })

  const { fields } = useFieldArray({
    control,
    name: 'subscriptions',
    rules: {
      minLength: Number(quantity),
    },
  })

  const { mutate } = useMutation({
    mutationFn: async ({ subscriptions }: FormData) => {
      const payload: FormData = { subscriptions }

      const { data } = await axios.post('/api/', payload)

      return data
    },
    onSuccess: (data) => {
      localStorage.setItem('cart_hash', data.cart_hash)
    },
  })

  const handleConfirm: SubmitHandler<FormData> = async (data) => {
    mutate(data)
  }

  return (
    <div className="w-full flex items-center justify-center py-4">
      <Card>
        <CardHeader>
          <CardTitle>Realizar Inscrições para o Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleConfirm)}
          >
            {fields.map((field, index) => (
              <div key={field.id}>
                <h2 className="text-lg font-medium">
                  Participante - {index + 1}
                </h2>
                <div className="flex flex-col gap-2">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input {...register(`subscriptions.${index}.name`)} />
                    <p className="text-sm font-medium text-destructive">
                      {errors.subscriptions?.[index]?.name?.message}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input {...register(`subscriptions.${index}.email`)} />
                    <p className="text-sm font-medium text-destructive">
                      {errors.subscriptions?.[index]?.email?.message}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Campo</Label>
                    <Input {...register(`subscriptions.${index}.campo`)} />
                    <p className="text-sm font-medium text-destructive">
                      {errors.subscriptions?.[index]?.campo?.message}
                    </p>
                  </div>
                </div>
                {index < Number(quantity) - 1 && <Separator />}
              </div>
            ))}
            <Button type="submit">Confirmar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
