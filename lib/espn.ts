// Helper para conectarse e interactuar con la API pública de ESPN (oculta)
// Endpoint general de scores diarios:
// URL: https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard

export interface ESPNEventInfo {
  id: string
  date: string // ISO
  name: string // "Boca Juniors at River Plate"
  shortName: string // "BOC @ RIV"
  status: {
    clock: number // Segundos transcurridos (no siempre exacto)
    displayClock: string // "45'", "90'+4'"
    period: number
    type: {
        name: string // "STATUS_IN_PROGRESS", "STATUS_FULL_TIME", "STATUS_SCHEDULED", "STATUS_CANCELED"
        state: string // "in", "pre", "post"
        completed: boolean
    }
  }
  competitors: {
    id: string
    homeAway: "home" | "away"
    score: string // "0", "1"...
    team: {
      name: string
      displayName: string // "River Plate"
      abbreviation: string
      logo?: string
    }
  }[]
}

// 1. Obtener todos los partidos de fútbol del mundo (top leagues) del día (o cercanos)
export async function fetchEspnDailyScoreboard(): Promise<ESPNEventInfo[]> {
  try {
    const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard", {
      next: { revalidate: 30 } // cachear 30s para no spammar y evitar re-busquedas masivas
    })
    
    if (!res.ok) return []
    const data = await res.json()
    // data.events array
    return data.events || []
  } catch (error) {
    console.error("Error fetching ESPN Scoreboard:", error)
    return []
  }
}

// 2. Fetcher específico para pedir el detalle de 1 partido (usado por el cron)
export async function fetchEspnEventSummary(eventId: string): Promise<ESPNEventInfo | null> {
    try {
        const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/all/summary?event=${eventId}`, {
            next: { revalidate: 0 } // Siempre freco para el live
        })
        if (!res.ok) return null
        const data = await res.json()
        return data.header?.competitions?.[0] as ESPNEventInfo // El summary structure es un pelin diferente (esta dentro de header.competitions)
    } catch (e) {
        return null
    }
}

// 3. Emparejamiento borroso (Fuzzy Matcher)
// Trata de buscar dentro del scoreboard de ESPN el ID del evento de nuestro partido.
export function matchEspnEvent(
  localTitle: string, 
  visitanteTitle: string, 
  espnEvents: ESPNEventInfo[]
): string | null {
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, '')
  
  const targetLocal = norm(localTitle)
  const targetVisita = norm(visitanteTitle)

  // Primero buscar coincidencia estricta en displayName
  for (const ev of espnEvents) {
     const homeTeam = ev.competitors?.find(c => c.homeAway === 'home')?.team.displayName || ''
     const awayTeam = ev.competitors?.find(c => c.homeAway === 'away')?.team.displayName || ''
     
     const espnL = norm(homeTeam)
     const espnV = norm(awayTeam)

     // Si ambos lados se incluyen o coinciden
     if ((espnL.includes(targetLocal) || targetLocal.includes(espnL)) && 
         (espnV.includes(targetVisita) || targetVisita.includes(espnV))) {
             return ev.id
     }
  }

  // Si no encuentra, tratar de ser mas agresivo comparando las primeras letras (útil para "Talleres (C)" vs "Talleres")
  for (const ev of espnEvents) {
    const homeTeam = ev.competitors?.find(c => c.homeAway === 'home')?.team.displayName || ''
    const awayTeam = ev.competitors?.find(c => c.homeAway === 'away')?.team.displayName || ''
    
    const espnL = norm(homeTeam).split(' ')[0]
    const espnV = norm(awayTeam).split(' ')[0]

    const tgtL = targetLocal.split(' ')[0]
    const tgtV = targetVisita.split(' ')[0]

    if (espnL.length > 2 && espnV.length > 2 && espnL === tgtL && espnV === tgtV) {
        return ev.id
    }
  }

  return null
}
