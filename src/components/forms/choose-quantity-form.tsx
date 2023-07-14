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

export function ChooseQuantityForm() {
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
        router.push(`/evento/inscricao?quantity=${data.quantity}`)
      } catch (error) {
        error instanceof Error
          ? toast.error(error.message)
          : toast.error('Algo deu errado, por favor tente novamente')
      }
    })
  }

  return (
    <Form {...form}>
      <h1>Conselho da Juventude</h1>
      <Separator />
      <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}>
        <div className="grid grid-cols-2 mt-4">
          <div className="flex flex-col gap-4">
            <h2>Preço:</h2>
            <h2>Quantidade:</h2>
            <h2>Subtotal:</h2>
          </div>
          <div className="flex flex-col gap-4">
            <span>R$ 100,00</span>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="hover:bg-zinc-300 py-1 rounded-md"
                        onClick={() =>
                          form.watch('quantity') > 1 &&
                          form.setValue('quantity', field.value - 1)
                        }
                      >
                        <Minus />
                      </button>
                      <Input min="1" className="text-center" {...field} />
                      <button
                        type="button"
                        className="hover:bg-zinc-300 py-1 rounded-md"
                        onClick={() =>
                          form.setValue('quantity', field.value + 1)
                        }
                      >
                        <Plus />
                      </button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <span>{formatPrice(form.watch('quantity') * 100)}</span>
          </div>
        </div>
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
