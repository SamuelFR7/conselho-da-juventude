import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

interface TicketsEmailProps {
  attendees: {
    name: string
    id: string
  }[]
}

export default function TicketsEmail({
  attendees = [
    {
      id: 'testID',
      name: 'Teste',
    },
  ],
}: TicketsEmailProps) {
  return (
    <Html>
      <Head>
        <title>Ingressos para o Conselho da Juventude - 2023</title>
      </Head>
      <Tailwind>
        <Body className="mx-auto bg-zinc-50 font-sans">
          <Container className="mx-auto my-[40px] max-w-2xl rounded p-4">
            <Section>
              <Heading className="text-center text-2xl font-semibold text-zinc-800">
                Você comprou ingressos para a o Conselho da Juventude 2023. Aqui
                estão os ingressos de cada participante que você cadastrou,
                apresente o QRCode para confirmar sua presença no evento
              </Heading>
            </Section>
            <Hr />
            {attendees.map((attendee) => (
              <>
                <Section key={attendee.id}>
                  <Text className="text-lg font-semibold">
                    Participante: {attendee.name}
                  </Text>
                  <Link
                    href={`https://juventude.cadesgo.com.br/ingresso/${attendee.id}`}
                  >
                    Download Ingresso
                  </Link>
                </Section>
                <Hr />
              </>
            ))}
            <Section className="mt-4 text-center text-zinc-400">
              <Text className="my-4">Qualquer dúvida entre em contato.</Text>
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
