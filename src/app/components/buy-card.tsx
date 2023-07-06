'use client'
import { Minus, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from './ui/form'

const buyCardSchema = z.object({
  quantity: z
    .number()
    .min(1, { message: 'Você deve realizar ao menos uma inscrição' })
    .default(1),
})

export type BuyCardSchemaType = z.infer<typeof buyCardSchema>

export function BuyCard() {
  const form = useForm<BuyCardSchemaType>({
    resolver: zodResolver(buyCardSchema),
    defaultValues: {
      quantity: 1,
    },
  })

  const onSubmit: SubmitHandler<BuyCardSchemaType> = (data) => {
    localStorage.setItem('cart_hash')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Realizar inscrição</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <h1>Evento do Nome...</h1>
          <Separator />
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                <span>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(form.watch('quantity') * 100)}
                </span>
              </div>
            </div>
            <div>
              <Button type="submit" className="mt-4 w-full">
                Comprar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
