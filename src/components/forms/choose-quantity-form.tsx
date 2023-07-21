'use client'
import { Minus, Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { useRouter } from 'next/navigation'
import { Input } from '../ui/input'
import React from 'react'
import { Icons } from '../icons'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/utils'

const chooseQuantitySchema = z.object({
  quantity: z
    .number()
    .min(1, { message: 'Você deve realizar ao menos uma inscrição' })
    .default(1),
})

export type Inputs = z.infer<typeof chooseQuantitySchema>

interface ChooseQuantityFormProps {
  redirectUrl?: string
}

export function ChooseQuantityForm({ redirectUrl }: ChooseQuantityFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(chooseQuantitySchema),
    defaultValues: {
      quantity: 1,
    },
  })

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      try {
        router.push(
          `${redirectUrl ?? '/evento/inscricao'}?quantity=${data.quantity}`,
        )
      } catch (error) {
        error instanceof Error
          ? toast.error(error.message)
          : toast.error('Algo deu errado, por favor tente novamente')
      }
    })
  }

  return (
    <Form {...form}>
      <Separator />
      <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}>
        <table className="w-full">
          <thead>
            <tr>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">Preço:</td>
              <td className="text-right">R$ 100,00</td>
            </tr>
            <tr>
              <td className="py-2">Quantidade:</td>
              <td>
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              form.watch('quantity') > 1 &&
                              form.setValue('quantity', field.value - 1)
                            }
                          >
                            <Minus />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            className="h-8 w-14 text-center"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              form.setValue('quantity', field.value + 1)
                            }
                          >
                            <Plus />
                          </Button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </td>
            </tr>
            <tr>
              <td className="py-2">Subtotal: </td>
              <td className="text-right">
                {formatPrice(form.watch('quantity') * 100)}
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <Button disabled={isPending} type="submit" className="mt-4 w-full">
            {isPending && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}{' '}
            Ir para inscrições
            <span className="sr-only">Ir para inscrições</span>
          </Button>
        </div>
      </form>
    </Form>
  )
}
