import { ZONAS } from '@/types'

export function calcularHorarios(horaUtc: string): [string, string][] {
  const fecha = new Date(horaUtc)
  return ZONAS.map(z => {
    const hora = fecha.toLocaleTimeString('es', {
      timeZone: z.tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    return [z.pais, hora]
  })
}

export function slugify(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function buscarEscudo(equipo: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(equipo)}`
    )
    const data = await res.json()
    const team = data?.teams?.[0]
    if (!team) return null
    
    // Fallback order: Badge -> Logo -> TeamBadge -> TeamLogo
    return team.strBadge || team.strLogo || team.strTeamBadge || team.strTeamLogo || null
  } catch {
    return null
  }
}

export function getTimezoneEstimates(horaArg: string): { grupo: string; countries: string; offset: number; time: string }[] {
  // horaArg format: "HH:mm"
  const [h, m] = horaArg.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return []

  const base = new Date()
  base.setHours(h, m, 0, 0)

  const groups = [
    { grupo: 'G1', countries: 'Argentina, Brasil, Uruguay, Chile', offset: 0 },
    { grupo: 'G2', countries: 'Paraguay, Bolivia, Venezuela', offset: -1 },
    { grupo: 'G3', countries: 'Colombia, Perú', offset: -2 },
    { grupo: 'G4', countries: 'México (CDMX)', offset: -3 },
    { grupo: 'G5', countries: 'España', offset: 4 },
  ]

  return groups.map(g => {
    const d = new Date(base.getTime() + g.offset * 3600000)
    return {
      ...g,
      time: d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
    }
  })
}

export async function buscarFixture(
  equipoLocal: string,
  equipoVisitante: string
): Promise<{ fixture_id: number; hora_utc: string; local: string; visitante: string; escudo_local: string | null; escudo_visitante: string | null }[]> {
  try {
    const headers = { 'x-apisports-key': process.env.API_FOOTBALL_KEY! }
    
    // API-Football search
    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures?team=${encodeURIComponent(equipoLocal)}&next=15`,
      { headers }
    )
    const data = await res.json()
    const fixtures = data?.response || []

    const vLower = equipoVisitante.toLowerCase()
    
    const coincidencias = fixtures.filter((f: any) => {
      const home = f.teams.home.name.toLowerCase()
      const away = f.teams.away.name.toLowerCase()
      return home.includes(vLower) || away.includes(vLower) || 
             vLower.includes(home.substring(0, 5)) || vLower.includes(away.substring(0, 5))
    })

    const finalFixtures = coincidencias.length > 0 ? coincidencias : fixtures.slice(0, 5)

    const resultados = await Promise.all(finalFixtures.map(async (f: any) => {
      const [eLocal, eVisitante] = await Promise.all([
        buscarEscudo(f.teams.home.name),
        buscarEscudo(f.teams.away.name),
      ])
      
      return {
        fixture_id: f.fixture.id,
        hora_utc: f.fixture.date,
        local: f.teams.home.name,
        visitante: f.teams.away.name,
        escudo_local: eLocal || f.teams.home.logo,
        escudo_visitante: eVisitante || f.teams.away.logo,
      }
    }))

    return resultados
  } catch {
    return []
  }
}

export const REDIR_BASE = process.env.NEXT_PUBLIC_URL || ''

export function redirUrl(url: string, titulo: string): string {
  return `/r?url=${encodeURIComponent(url)}&t=${encodeURIComponent(titulo)}`
}
