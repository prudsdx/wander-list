'use client'

import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import {
  Command, CommandInput, CommandList,
  CommandItem, CommandEmpty,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ChevronsUpDown, Loader2 } from 'lucide-react'
import { searchPlaces, type PlaceSuggestion } from '@/lib/geocode'

interface Props {
  onSelect: (s: PlaceSuggestion) => void
  placeholder?: string
}

export function PlaceAutocomplete({
  onSelect,
  placeholder = 'Search for a place…',
}: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 350)
  const [results, setResults] = useState<PlaceSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!debouncedQuery) { setResults([]); return }
    setLoading(true)
    searchPlaces(debouncedQuery)
      .then(setResults)
      .finally(() => setLoading(false))
  }, [debouncedQuery])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
          {query || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type a city or landmark…"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {loading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            {!loading && debouncedQuery && results.length === 0 && (
              <CommandEmpty>No results — fill in the fields below manually.</CommandEmpty>
            )}
            {results.map((r, i) => (
              <CommandItem
                key={i}
                value={r.label}
                onSelect={() => {
                  onSelect(r)
                  setQuery(r.label)
                  setOpen(false)
                }}
              >
                {r.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}