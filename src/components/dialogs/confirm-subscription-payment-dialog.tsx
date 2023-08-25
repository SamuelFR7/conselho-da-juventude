'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Icons } from "../icons"
import React from "react"
import { catchError } from "@/lib/utils"
import { confirmSubscriptionPaymentAction } from "@/app/_actions/subscriptions"

interface DeleteSubscriptionDialogProps {
  attendeeId: string
}

export default function ConfirmSubscriptionPaymentDialog({attendeeId}: DeleteSubscriptionDialogProps) {
  const [isPending, startTransition] = React.useTransition()

  function submitConfirmation() {
    startTransition(async () => {
      try {
        await confirmSubscriptionPaymentAction(attendeeId) 
      } catch (error) {
        catchError(error)
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size='icon'><Icons.confirm /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não poderá ser desfeita
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={submitConfirmation} disabled={isPending}>
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden='true' />  
            )}
           Confirmar 
            <span className="sr-only">Confirmar</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
