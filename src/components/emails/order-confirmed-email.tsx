import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

type Subscription = {
  id: string
  attendees: {
    id: string
    name: string
    email: string
    campo: string
  }[]
  status: string
}

interface OrderConfirmedEmailProps {
  customerName?: string | null
  subscriptions: Subscription[]
}

export default function OrderConfirmedEmail({
  customerName,
  subscriptions = [],
}: OrderConfirmedEmailProps) {
  return (
    <Html>
      <Head>
        <title>Compra efetuada com sucesso</title>
      </Head>
      <Tailwind>
        <Body className="mx-auto bg-zinc-50 font-sans">
          <Container className="mx-auto my-[40px] max-w-2xl rounded p-4">
            <Section className="mt-4">
              <Heading className="text-center text-2xl font-semibold text-zinc-950">
                Conselho da Juventude - 2023
              </Heading>
              <Hr className="my-4" />
              <Heading className="text-center text-3xl font-semibold text-zinc-800">
                Parabéns, sua compra de ingressos para o Conselho da Juventude
                2023 foi efetuada com sucesso, você recebrá seu QrCode no
                próximo email
              </Heading>
              <Text className="mb-0 mt-6 text-base">
                Olá{` ${customerName}`}, acabamos de efetivar sua compra.
              </Text>
            </Section>
            <Hr />
            <Section className="mt-2">
              <Heading className="text-xl font-medium">
                Resumo da Compra:
              </Heading>
              {subscriptions.map((sub) => (
                <Text key={sub.id}>
                  {sub.attendees.length}x - Ingressos Conselho da Juventude 2023
                </Text>
              ))}
              <Text>
                Valor total:{' '}
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(
                  subscriptions.reduce(
                    (total, item) => (total = total + item.attendees.length),
                    0,
                  ) * 100,
                )}
              </Text>
            </Section>
            <Section className="mt-4 text-center text-zinc-400">
              <Text className="my-4">
                Qualquer dúvida entre em contato com nosso suporte.
              </Text>
              <Text className="mb-0 mt-4">
                @Cadesgo {new Date().getFullYear()}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
