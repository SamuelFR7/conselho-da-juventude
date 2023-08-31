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
import { Icons } from '@/components/icons'
import { Shell } from '@/components/shells/shell'
import { TablePagination } from '@/components/table-pagination'
import {
  getAllAttendeesAction,
  getPayedAndConfirmedAttendeesAction,
  getPayedAttendeesAction,
  getToPayAttendeesAction,
} from '@/app/_actions/attendees'
import DeleteSubscriptionDialog from '@/components/dialogs/delete-subscription-dialog'

interface AdminPageProps {
  searchParams: {
    page?: string
  }
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { attendees: allAttendees, count } = await getAllAttendeesAction(
    searchParams.page ? parseInt(searchParams.page) : 1
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className='text-center'>Tamanho da Camiseta</TableHead>
            <TableHead>Campo</TableHead>
            <TableHead>Status de Pagamento</TableHead>
            <TableHead>Confirmada</TableHead>
            <TableHead className='text-center'>Gerenciar</TableHead>
            <TableHead className='text-center'>Deletar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAttendees.map((attendee) => (
            <TableRow key={attendee.id}>
              <TableCell>{toTitleCase(attendee.name)}</TableCell>
              <TableCell>{attendee.email}</TableCell>
              <TableCell className='text-center'>
                {attendee.shirtSize}
              </TableCell>
              <TableCell>{attendee.field.name}</TableCell>
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
              <TableCell className='text-center'>
                <Link href={`/evento/admin/confirm/${attendee.id}`}>
                  <Button size="icon" variant="ghost">
                    <Icons.settings />
                  </Button>
                </Link>
              </TableCell>
              <TableCell className='text-center'>
              {dateDifferenceFromToday(attendee.Subscription.createdAt) > 4 && attendee.Subscription.payment.paymentStatus !== 'paid' && ( 
                <DeleteSubscriptionDialog id={attendee.id} />
              )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        currentPage={searchParams.page ? parseInt(searchParams.page) : 1}
        dataCount={count}
      />
    </Shell>
  )
}
