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
import { deleteSubscriptionAction } from "@/app/_actions/subscriptions"

interface DeleteSubscriptionDialogProps {
  id: string
}

export default function DeleteSubscriptionDialog({id}: DeleteSubscriptionDialogProps) {
  const [isPending, startTransition] = React.useTransition()

  function submitDelete() {
    startTransition(async () => {
      try {
        await deleteSubscriptionAction(id) 
      } catch (error) {
        catchError(error)
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size='icon'><Icons.delete /></Button>
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
          <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={submitDelete} disabled={isPending}>
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden='true' />  
            )}
            Deletar
            <span className="sr-only">Deletar</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
