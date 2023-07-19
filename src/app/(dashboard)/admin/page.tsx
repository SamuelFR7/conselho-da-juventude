import {
  getAllAttendees,
  getPayedAndConfirmedAttendees,
  getPayedAttendees,
  getToPayAttendees,
} from '@/app/_actions/attendees'
import { Icons } from '@/components/icons'
import { Shell } from '@/components/shells/shell'
import { TablePagination } from '@/components/table-pagination'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn, toTitleCase } from '@/lib/utils'
import Link from 'next/link'

interface AdminPageProps {
  searchParams: {
    page?: string
  }
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { attendees: allAttendees, count } = await getAllAttendees(1)
  const payedAndConfirmedAttendees = await getPayedAndConfirmedAttendees()
  const payedAttendees = await getPayedAttendees()
  const toPayAttendees = await getToPayAttendees()

  return (
    <Shell>
      <div className="grid lg:grid-cols-3 gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.user className="text-green-500 font-semibold" />
              Inscrições Confirmadas
            </CardTitle>
            <CardDescription>
              Inscrições que foram pagas, e que o QRCode já foi lido
            </CardDescription>
          </CardHeader>
          <CardContent className="text-2xl text-right font-semibold">
            {payedAndConfirmedAttendees}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.user className="text-red-500 font-semibold" />
              Inscrições Pagas
            </CardTitle>
            <CardDescription>
              Inscrições pagas mas sem a presença confirmada
            </CardDescription>
          </CardHeader>
          <CardContent className="text-2xl text-right font-semibold">
            {payedAttendees}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.user className="text-green-500 font-semibold" />
              Inscrições À Pagar
            </CardTitle>
            <CardDescription>
              Inscrições feitas porém ainda não foram pagas
            </CardDescription>
          </CardHeader>
          <CardContent className="text-2xl text-right font-semibold">
            {toPayAttendees}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent>
          <CardHeader>
            <CardTitle>Inscritos</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status de Pagamento</TableHead>
                <TableHead>Confirmada</TableHead>
                <TableHead>Gerenciar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allAttendees.map((attendee) => (
                <TableRow key={attendee.id}>
                  <TableCell>{toTitleCase(attendee.name)}</TableCell>
                  <TableCell>{attendee.email}</TableCell>
                  <TableCell
                    className={cn(
                      attendee.Subscription?.Cart?.Order?.paymentStatus ===
                        'PENDENTE'
                        ? 'text-yellow-500'
                        : attendee.Subscription?.Cart?.Order?.paymentStatus ===
                          'PAGO'
                        ? 'text-green-500'
                        : '',
                    )}
                  >
                    {toTitleCase(
                      attendee.Subscription?.Cart?.Order?.paymentStatus ??
                        'Não foi possível carregar',
                    )}
                  </TableCell>
                  <TableCell
                    className={cn(
                      attendee.confirmedPresence
                        ? 'text-green-500'
                        : 'text-red-500',
                    )}
                  >
                    {attendee.confirmedPresence ? 'SIM' : 'NÃO'}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/confirm/${attendee.id}`}>
                      <Button size="icon" variant="ghost">
                        <Icons.settings />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <TablePagination
        currentPage={searchParams.page ? parseInt(searchParams.page) : 1}
        dataCount={count}
      />
    </Shell>
  )
}
