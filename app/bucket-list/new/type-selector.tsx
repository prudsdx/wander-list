"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Mountain } from "lucide-react"

export type ItemType = "place" | "trail"

interface TypeSelectorProps {
  onSelect: (type: ItemType) => void
}

export function TypeSelector({ onSelect }: TypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onSelect("place")}
        className="text-left"
      >
        <Card className="h-full transition-colors hover:border-border/80">
          <CardContent className="p-5">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-lg font-semibold">Place</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cities, towns, landmarks
            </p>
          </CardContent>
        </Card>
      </button>

      <button
        type="button"
        onClick={() => onSelect("trail")}
        className="text-left"
      >
        <Card className="h-full transition-colors hover:border-border/80">
          <CardContent className="p-5">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Mountain className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-lg font-semibold">Trail</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Hikes, treks, walks
            </p>
          </CardContent>
        </Card>
      </button>
    </div>
  )
}
