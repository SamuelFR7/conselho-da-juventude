'use client'

import React from 'react'
import { type Attendee } from '@prisma/client'
import { Pencil } from 'lucide-react'

import { EditAttendeeNameForm } from '../forms/edit-attendee-name-form'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

interface EditAttendeeNameDialogProps {
  attendee: Attendee
}

export function EditAttendeeNameDialog({
  attendee,
}: EditAttendeeNameDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar nome</DialogTitle>
        </DialogHeader>
        <EditAttendeeNameForm attendee={attendee} setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  )
}
