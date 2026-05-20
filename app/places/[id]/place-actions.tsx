"use client"

import Link from "next/link"
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
import { deletePlace, toggleVisited } from "./actions"

interface PlaceActionsProps {
  id: string
  name: string
  isVisited: boolean
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
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={deletePlace.bind(null, id)}>
            <AlertDialogAction
              type="submit"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function PlaceActions({ id, name, isVisited, layout }: PlaceActionsProps) {
  const toggleLabel = isVisited ? "Mark as Unvisited" : "Mark as Visited"

  if (layout === "desktop") {
    return (
      <div className="mt-8 hidden gap-3 md:flex">
        <form action={toggleVisited.bind(null, id, isVisited)} className="flex-1">
          <Button type="submit" className="w-full">
            <Check className="mr-2 h-4 w-4" />
            {toggleLabel}
          </Button>
        </form>
        <Button variant="outline" className="flex-1" asChild>
          <Link href={`/places/${id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <DeleteDialog
          id={id}
          name={name}
          trigger={
            <Button
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
        <form action={toggleVisited.bind(null, id, isVisited)} className="flex-1">
          <Button type="submit" className="w-full">
            <Check className="mr-2 h-4 w-4" />
            {toggleLabel}
          </Button>
        </form>
        <Button variant="outline" size="icon" asChild>
          <Link href={`/places/${id}/edit`}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Link>
        </Button>
        <DeleteDialog
          id={id}
          name={name}
          trigger={
            <Button
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
