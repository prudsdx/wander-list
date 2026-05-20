export interface PlaceSuggestion {
    label: string    // shown in dropdown: "Kyoto, Kyoto Prefecture, Japan"
    name: string     // "Kyoto"
    city: string     // "Kyoto"
    country: string  // "Japan"
  }
  
  export async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
    if (query.length < 2) return []
  
    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6&lang=en`,
        { signal: AbortSignal.timeout(5000) }
      )
      if (!res.ok) return []
  
      const data = await res.json()
  
      return (data.features ?? [])
        .filter((f: any) => f.properties?.country)
        .map((f: any) => {
          const p = f.properties
          const city = p.city ?? p.town ?? p.village ?? p.name
          const country = p.country
          const name = p.name
          return {
            label: [name, p.state, country].filter(Boolean).join(', '),
            name,
            city,
            country,
          }
        })
    } catch {
      return [] // silently fail — user can still type manually
    }
  }