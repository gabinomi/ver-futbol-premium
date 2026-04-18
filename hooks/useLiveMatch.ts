'use client'
import { useState, useEffect } from 'react'

export interface LiveMatchState {
  golLocal: number
  golVisitante: number
  estado: string // 'PRÓXIMO' | 'EN-VIVO' | 'FINALIZADO'
  reloj: string | null
}

export function useLiveMatch(
  espnId: string | null | undefined,
  initialState: LiveMatchState
) {
  const [liveState, setLiveState] = useState<LiveMatchState>(initialState)

  useEffect(() => {
    // Si no hay ID o si el partido ya estaba finalizado al cargar, no hacemos polling
    if (!espnId || initialState.estado === 'FINALIZADO') {
      return
    }

    let isMounted = true
    let intervalId: NodeJS.Timeout

    const fetchLive = async () => {
      try {
        const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/all/summary?event=${espnId}`, {
          cache: 'no-store'
        })
        if (!res.ok) return
        
        const data = await res.json()
        const event = data?.header?.competitions?.[0]
        if (!event) return

        const home = event.competitors?.find((c: any) => c.homeAway === 'home')
        const away = event.competitors?.find((c: any) => c.homeAway === 'away')
        if (!home || !away) return

        const stateName = event.status?.type?.name || ''
        const clock = event.status?.displayClock || null
        
        // Determinar estado
        let nuevoEstado = liveState.estado
        if (stateName === 'STATUS_FULL_TIME' || stateName === 'STATUS_CANCELED' || stateName === 'STATUS_POSTPONED') {
          nuevoEstado = 'FINALIZADO'
        } else if (stateName === 'STATUS_IN_PROGRESS' || stateName === 'STATUS_HALFTIME') {
          nuevoEstado = 'EN-VIVO'
        }

        const newState: LiveMatchState = {
          golLocal: parseInt(home.score || '0', 10),
          golVisitante: parseInt(away.score || '0', 10),
          estado: nuevoEstado,
          reloj: clock
        }

        if (isMounted) {
          setLiveState(newState)
          // Si finalizó, paramos el polling
          if (newState.estado === 'FINALIZADO') {
            clearInterval(intervalId)
          }
        }
      } catch (err) {
        // Silencioso. Evitar spam en consola.
      }
    }

    // Ejecutar de inmediato y luego cada 30 segundos
    fetchLive()
    intervalId = setInterval(fetchLive, 30000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [espnId]) // Solo depende del ID. Si el ID cambia, rearranca.

  return liveState
}
