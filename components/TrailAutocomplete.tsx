'use client'

import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import {
  Command,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { searchTrails, type TrailSuggestion } from '@/lib/trails-search'

interface Props {
  onSelect: (s: TrailSuggestion) => void
}

export function TrailAutocomplete({ onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 500)
  const [results, setResults] = useState<TrailSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setResults([])
      return
    }
    setLoading(true)
    searchTrails(debouncedQuery)
      .then(setResults)
      .finally(() => setLoading(false))
  }, [debouncedQuery])

  const selectSuggestion = (suggestion: TrailSuggestion) => {
    onSelect(suggestion)
    setQuery(suggestion.name)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Input
          placeholder="Search for a trail…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          className="w-full"
        />
      </PopoverAnchor>
      <PopoverContent
        className="w-[var(--radix-popover-anchor-width)] p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandList>
            {loading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            {!loading && debouncedQuery.length >= 3 && results.length === 0 && (
              <CommandEmpty>
                Not found — type the name manually below.
              </CommandEmpty>
            )}
            {results.map((r, i) => (
              <CommandItem
                key={`${r.name}-${r.region}-${r.country}-${i}`}
                value={`${r.name} ${r.region} ${r.country}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(r)}
                onSelect={() => selectSuggestion(r)}
              >
                <span>{r.name}</span>
                {(r.region || r.country) && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    {[r.region, r.country].filter(Boolean).join(', ')}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
