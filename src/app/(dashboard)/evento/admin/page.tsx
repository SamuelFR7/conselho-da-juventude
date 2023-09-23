import Link from 'next/link'

import {
  cn,
  dateDifferenceFromToday,
  handlePaymentStatus,
  paymentClassname,
  toTitleCase,
} from '@/lib/utils'
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
import DeleteSubscriptionDialog from '@/components/dialogs/delete-subscription-dialog'
import { EditAttendeeNameDialog } from '@/components/dialogs/edit-attendee-name-dialog'
import { Icons } from '@/components/icons'
import { SearchByName } from '@/components/search-by-name'
import { Shell } from '@/components/shells/shell'
import { TablePagination } from '@/components/table-pagination'
import {
  getAllAttendeesAction,
  getPayedAndConfirmedAttendeesAction,
  getPayedAttendeesAction,
  getToPayAttendeesAction,
} from '@/app/_actions/attendees'

interface AdminPageProps {
  searchParams: {
    page?: string
    search?: string
  }
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { attendees: allAttendees, count } = await getAllAttendeesAction(
    searchParams.page ? parseInt(searchParams.page) : 1,
    searchParams.search
  )
  const payedAndConfirmedAttendees = await getPayedAndConfirmedAttendeesAction()
  const payedAttendees = await getPayedAttendeesAction()
  const toPayAttendees = await getToPayAttendeesAction()

  return (
    <Shell>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.user className="font-semibold text-green-500" />
              Inscrições Confirmadas
            </CardTitle>
            <CardDescription>
              Inscrições que foram pagas, e que o QRCode já foi lido
            </CardDescription>
          </CardHeader>
          <CardContent className="text-right text-2xl font-semibold">
            {payedAndConfirmedAttendees}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.user className="font-semibold text-yellow-500" />
              Inscrições Pagas
            </CardTitle>
            <CardDescription>
              Inscrições pagas mas sem a presença confirmada
            </CardDescription>
          </CardHeader>
          <CardContent className="text-right text-2xl font-semibold">
            {payedAttendees}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.user className="font-semibold text-red-500" />
              Inscrições À Pagar
            </CardTitle>
            <CardDescription>
              Inscrições feitas porém ainda não foram pagas
            </CardDescription>
          </CardHeader>
          <CardContent className="text-right text-2xl font-semibold">
            {toPayAttendees}
          </CardContent>
        </Card>
      </div>
      <SearchByName />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-center">Camiseta</TableHead>
            <TableHead>Campo</TableHead>
            <TableHead>Data de Pagamento</TableHead>
            <TableHead>Status de Pagamento</TableHead>
            <TableHead>Confirmada</TableHead>
            <TableHead className="text-center">Editar</TableHead>
            <TableHead className="text-center">Deletar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAttendees.map((attendee) => (
            <TableRow key={attendee.id}>
              <TableCell>{toTitleCase(attendee.name)}</TableCell>
              <TableCell>{attendee.email}</TableCell>
              <TableCell className="text-center">
                {attendee.shirtSize}
              </TableCell>
              <TableCell>{attendee.field.name}</TableCell>
              <TableCell>
                {new Intl.DateTimeFormat('pt-BR', {
                  dateStyle: 'long',
                  timeZone: 'America/Sao_Paulo',
                }).format(attendee.Subscription.payment.updatedAt)}
              </TableCell>
              <TableCell
                className={cn(
                  paymentClassname(attendee.Subscription.payment.paymentStatus)
                )}
              >
                {toTitleCase(
                  handlePaymentStatus(
                    attendee.Subscription.payment.paymentStatus
                  )
                )}
              </TableCell>
              <TableCell
                className={cn(
                  attendee.confirmedPresence ? 'text-green-500' : 'text-red-500'
                )}
              >
                {attendee.confirmedPresence ? 'SIM' : 'NÃO'}
              </TableCell>
              <TableCell className="text-center">
                <EditAttendeeNameDialog attendee={attendee} />
              </TableCell>
              <TableCell className="text-center">
                {dateDifferenceFromToday(attendee.Subscription.createdAt) > 4 &&
                  attendee.Subscription.payment.paymentStatus !== 'paid' && (
                    <DeleteSubscriptionDialog id={attendee.id} />
                  )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        currentPage={
          searchParams.page
            ? parseInt(searchParams.page) > 0
              ? parseInt(searchParams.page)
              : 1
            : 1
        }
        search={searchParams.search}
        dataCount={count}
      />
    </Shell>
  )
}
