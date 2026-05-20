"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { TypeSelector, type ItemType } from "./type-selector"
import { PlaceForm } from "./place-form"
import { TrailForm } from "./trail-form"

export default function NewBucketListPage() {
  const [itemType, setItemType] = useState<ItemType | null>(null)

  const title =
    itemType === null
      ? "Add to Bucket List"
      : itemType === "place"
        ? "Add Place"
        : "Add Trail"

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-3 px-4">
          <Link href="/bucket-list">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl p-4">
        {itemType === null && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              What would you like to add?
            </p>
            <TypeSelector onSelect={setItemType} />
          </div>
        )}

        {itemType === "place" && (
          <PlaceForm onChangeType={() => setItemType(null)} />
        )}

        {itemType === "trail" && (
          <TrailForm onChangeType={() => setItemType(null)} />
        )}
      </main>
    </div>
  )
}
