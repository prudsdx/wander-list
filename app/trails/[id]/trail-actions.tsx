"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
import { Check, Pencil, Trash2 } from "lucide-react"
import { deleteTrail, toggleHiked } from "./actions"

interface TrailActionsProps {
  id: string
  name: string
  isHiked: boolean
  layout: "desktop" | "mobile"
}

function DeleteDialog({
  id,
  name,
  trigger,
}: {
  id: string
  name: string
  trigger: React.ReactNode
}) {
  const formId = `delete-trail-form-${id}`

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undone. This will permanently delete{" "}
            <span className="font-medium text-foreground">{name}</span> from your
            bucket list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form id={formId} action={deleteTrail.bind(null, id)} className="hidden" />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            form={formId}
            variant="destructive"
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function TrailActions({ id, name, isHiked, layout }: TrailActionsProps) {
  const router = useRouter()
  const toggleLabel = isHiked ? "Mark as Not Hiked" : "Mark as Hiked"

  if (layout === "desktop") {
    return (
      <div className="mt-8 hidden gap-3 md:flex">
        <form action={toggleHiked.bind(null, id, isHiked)} className="flex-1">
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Check className="mr-2 h-4 w-4" />
            {toggleLabel}
          </Button>
        </form>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.push(`/trails/${id}/edit`)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <DeleteDialog
          id={id}
          name={name}
          trigger={
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background p-4 md:hidden">
      <div className="mx-auto flex max-w-2xl gap-3">
        <form action={toggleHiked.bind(null, id, isHiked)} className="flex-1">
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Check className="mr-2 h-4 w-4" />
            {toggleLabel}
          </Button>
        </form>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => router.push(`/trails/${id}/edit`)}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <DeleteDialog
          id={id}
          name={name}
          trigger={
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          }
        />
      </div>
    </div>
  )
}
