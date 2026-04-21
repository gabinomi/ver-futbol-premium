'use client'
import { useState, useEffect } from 'react'
import { Partido } from '@/types'

export interface LiveMatchState {
  golLocal: number
  golVisitante: number
  estado: string // 'PRÓXIMO' | 'EN-VIVO' | 'FINALIZADO'
  reloj: string | null
}

const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/'

// Mapa de ligas tal como estaba en blogger
const SLUG_MAP: Record<string, string> = {
  'liga profesional': 'arg.1', 'primera nacional': 'arg.2',
  'copa argentina': 'arg.copa',
  'copa libertadores': 'conmebol.libertadores',
  'copa sudamericana': 'conmebol.sudamericana',
  'laliga': 'esp.1', 'la liga': 'esp.1', 'liga 2': 'esp.2',
  'champions league': 'uefa.champions', 'europa league': 'uefa.europa',
  'conference league': 'uefa.conference',
  'premier league': 'eng.1', 'serie a': 'ita.1',
  'bundesliga': 'ger.1', 'ligue 1': 'fra.1',
  'brasileirao': 'bra.1',
  'liga betplay': 'col.1', 'liga mx': 'mex.1',
}

function getSlugs(partido: Partido): string[] {
  // 1. Intentar con metadata.liga (nombre real de la liga importada del calendario)
  // Esto es equivalente a como Blogger usaba las "etiquetas" del post
  const liga = ((partido.metadata?.liga as string) || '').toLowerCase().trim()
  if (liga) {
    // Match directo
    if (SLUG_MAP[liga]) return [SLUG_MAP[liga]]
    // Match parcial (ej: "LaLiga" encuentra "laliga")
    const slugs: string[] = []
    Object.keys(SLUG_MAP).forEach(k => {
      if (liga.includes(k) || k.includes(liga)) {
        if (!slugs.includes(SLUG_MAP[k])) slugs.push(SLUG_MAP[k])
      }
    })
    if (slugs.length) return slugs
  }

  // 2. Fallback: intentar con categoria  
  const cat = ((partido.categoria) || '').toLowerCase().trim()
  if (cat) {
    if (SLUG_MAP[cat]) return [SLUG_MAP[cat]]
    const slugs: string[] = []
    Object.keys(SLUG_MAP).forEach(k => {
      if (cat.includes(k) && !slugs.includes(SLUG_MAP[k])) {
        slugs.push(SLUG_MAP[k])
      }
    })
    if (slugs.length) return slugs
  }

  // 3. Fallback: intentar con el titulo original del calendario
  const tituloOrig = ((partido.metadata?.titulo_original as string) || '').toLowerCase().trim()
  if (tituloOrig) {
    const slugs: string[] = []
    Object.keys(SLUG_MAP).forEach(k => {
      if (tituloOrig.includes(k) && !slugs.includes(SLUG_MAP[k])) {
        slugs.push(SLUG_MAP[k])
      }
    })
    if (slugs.length) return slugs
  }

  // 4. Último recurso: ligas argentinas por defecto
  return ['arg.1', 'arg.copa', 'conmebol.libertadores', 'conmebol.sudamericana']
}

export function norm(s: string) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(fc|cf|ac|sc|cd|ca|rc|ud|sd|as)\b/gi, '')
    .replace(/[^a-z0-9 ]/g, '').replace(/  +/g, ' ').trim()
}

export function coincide(a: string, b: string) {
  const na = norm(a), nb = norm(b)
  if (na.length < 3 || nb.length < 3) return false
  const m = Math.min(5, Math.min(na.length, nb.length))
  return na.includes(nb.substring(0, m)) || nb.includes(na.substring(0, m))
}

export function useLiveMatch(partido: Partido) {
  const initialState: LiveMatchState = {
    golLocal: partido.gol_local,
    golVisitante: partido.gol_visitante,
    estado: partido.estado,
    reloj: partido.metadata?.reloj || null
  }

  const [liveState, setLiveState] = useState<LiveMatchState>(initialState)

  useEffect(() => {
    // Si ya finalizó desde la base de datos, no hacemos polling
    if (initialState.estado === 'FINALIZADO') {
      return
    }

    let isMounted = true
    let intervalId: NodeJS.Timeout

    const procesarEvento = (ev: any) => {
      const comp = ev.competitions?.[0]
      if (!comp) return false
      const comps = comp.competitors || []
      const home = comps.find((c: any) => c.homeAway === 'home')
      const away = comps.find((c: any) => c.homeAway === 'away')
      if (!home || !away) return false

      // IMPORTANTE: ESPN pone status a nivel de EVENTO (ev.status), no dentro de competition
      // Esto es exactamente como funciona en la plantilla de Blogger (línea 1747-1748)
      const state = ev.status?.type?.state || comp.status?.type?.state || 'pre'
      const detail = ev.status?.type?.shortDetail || comp.status?.type?.shortDetail || ''
      const golL = home.score !== undefined ? parseInt(home.score, 10) : 0
      const golV = away.score !== undefined ? parseInt(away.score, 10) : 0
      
      const estadoMap: Record<string, string> = { 'in': 'EN-VIVO', 'post': 'FINALIZADO', 'pre': 'PRÓXIMO' }
      const estado = estadoMap[state] || 'PRÓXIMO'

      const mMatch = detail.match(/(\d+)/)
      const minuto = mMatch ? `Min ${mMatch[1]}'` : (detail === 'HT' ? 'ET' : null)

      if (isMounted) {
        setLiveState(prev => {
          // Solo actualizamos si hay cambios
          if (
            prev.golLocal !== golL ||
            prev.golVisitante !== golV ||
            prev.estado !== estado ||
            prev.reloj !== minuto
          ) {
            const newState = { golLocal: golL, golVisitante: golV, estado, reloj: minuto }
            if (estado === 'FINALIZADO') clearInterval(intervalId)
            return newState
          }
          return prev
        })
      }
      return true
    }

    const fetchLive = async () => {
      const slugs = getSlugs(partido)
      const espnId = partido.metadata?.espn_id

      try {
        // OPCION A: Por ID exacto en la cola de slugs correspondientes
        if (espnId) {
          const mainSlug = slugs[0] || 'arg.1'
          const r = await fetch(`${BASE_URL}${mainSlug}/scoreboard?limit=50`, { cache: 'no-store' })
          if (r.ok) {
            const data = await r.json()
            const ev = (data.events || []).find((e: any) => String(e.id) === String(espnId))
            if (ev) {
              procesarEvento(ev)
              return
            }
          }
        }

        // OPCION B: Fuzzy search match (igual a plantilla_v13.xml) por todos los slugs recomendados
        for (let i = 0; i < slugs.length; i++) {
          const res = await fetch(`${BASE_URL}${slugs[i]}/scoreboard?limit=50`, { cache: 'no-store' })
          if (!res.ok) continue
          const data = await res.json()
          
          const eventos = data.events || []
          for (let j = 0; j < eventos.length; j++) {
            const ev = eventos[j]
            const comp = ev.competitions && ev.competitions[0]
            if (!comp) continue
            
            const home = (comp.competitors || []).find((c: any) => c.homeAway === 'home')
            const away = (comp.competitors || []).find((c: any) => c.homeAway === 'away')
            if (!home || !away) continue

            const hName = home.team?.displayName || ''
            const aName = away.team?.displayName || ''

            if (coincide(partido.equipo_local, hName) && coincide(partido.equipo_visitante, aName)) {
              procesarEvento(ev)
              return
            }
          }
        }
      } catch (e) {
        // Silencioso
      }
    }

    fetchLive()
    intervalId = setInterval(fetchLive, 30000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [
    partido.metadata?.espn_id,
    partido.equipo_local,
    partido.equipo_visitante,
    partido.categoria,
    initialState.estado
  ])

  return liveState
}
