export interface TrailSuggestion {
  name: string
  region: string
  country: string
}

function parseTrailLocation(tags: Record<string, string>): {
  region: string
  country: string
} {
  let region =
    tags['addr:region'] ??
    tags.region ??
    tags.state ??
    tags['addr:state'] ??
    tags.location ??
    tags.place ??
    ''

  let country = tags['addr:country'] ?? tags.country ?? ''

  const isIn = tags.is_in ?? tags['is_in:country'] ?? ''
  if (isIn) {
    const parts = isIn.split(',').map((part) => part.trim()).filter(Boolean)
    if (parts.length >= 2) {
      if (!country) country = parts[parts.length - 1]
      if (!region) region = parts.slice(0, -1).join(', ')
    } else if (parts.length === 1) {
      if (!country) country = parts[0]
    }
  }

  return { region, country }
}

export async function searchTrails(query: string): Promise<TrailSuggestion[]> {
    if (query.length < 3) return []
  
    const overpassQuery = `
      [out:json][timeout:8];
      relation["type"="route"]["route"="hiking"]["name"~"${query}",i];
      out tags 10;
    `
  
    try {
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
        signal: AbortSignal.timeout(9000),
      })
      if (!res.ok) return []
  
      const data = await res.json()
  
      return (data.elements ?? [])
        .filter((el: { tags?: Record<string, string> }) => el.tags?.name)
        .map((el: { tags: Record<string, string> }) => {
          const { region, country } = parseTrailLocation(el.tags)
          return {
            name: el.tags.name,
            region,
            country,
          }
        })
    } catch {
      return []
    }
  }