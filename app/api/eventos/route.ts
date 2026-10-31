export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'

function getStatusPorHorario(timeStr: string, statusFromJson?: string): string {
  if (!timeStr || !timeStr.includes(':')) {
    return 'próximo'
  }
  
  let [h, m] = timeStr.split(':').map(Number)
  // La hora del JSON está en UTC-5 (hora Colombia/Perú/US Central).
  // Argentina está en UTC-3 (+2 horas de diferencia).
  const hArg = (h + 2) % 24
  
  const now = new Date()
  const argNowStr = new Intl.DateTimeFormat('en-US', { 
    timeZone: 'America/Argentina/Buenos_Aires', 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: false 
  }).format(now)
  
  let [nowH, nowM] = argNowStr.split(':').map(Number)
  if (nowH === 24) nowH = 0
  
  const nowMinutes = nowH * 60 + nowM
  const evMinutes = hArg * 60 + m
  
  let diff = nowMinutes - evMinutes
  // Ajuste en caso de cruzar medianoche (ej: ahora madrugada 01:00 y partido 23:30, o viceversa)
  if (nowMinutes < 300 && evMinutes > 1200) {
    diff = (nowMinutes + 1440) - evMinutes
  } else if (nowMinutes > 1200 && evMinutes < 300) {
    diff = nowMinutes - (evMinutes + 1440)
  }
  
  const s = (statusFromJson || '').toLowerCase().trim()
  // 1. Si streamtp reporta explícitamente "finished" o "finalizado", está finalizado
  if (s === 'finished' || s === 'finalizado') return 'finalizado'

  // 2. Si pasaron más de 135 minutos desde el inicio del evento, ya finalizó
  if (diff > 135) return 'finalizado'

  // 3. Si el status es 'live' y está dentro de una ventana razonable
  if (s === 'live' && diff >= -15 && diff <= 180) return 'en vivo'

  // 4. Si el status es 'next' y aún no empezó
  if (s === 'next' && diff < 0) return 'próximo'

  // 5. Ventana normal de partido en vivo: desde 5 minutos antes hasta 135 minutos después
  if (diff >= -5 && diff <= 135) return 'en vivo'
  
  return 'próximo'
}

async function fetchStreamX() {
  try {
    const res = await fetch('https://streamx723.sbs/json/agenda888.json?nocache=' + Date.now(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(6000)
    })
    if (!res.ok) return []
    const rawData = await res.json()
    if (Array.isArray(rawData)) {
      return rawData.map(ev => ({
        title: ev.title,
        time: ev.time,
        category: ev.category,
        link: ev.link || ev.url,
        status: getStatusPorHorario(ev.time, ev.status)
      }))
    }
    return []
  } catch (e) {
    return []
  }
}

async function fetchStreamTP() {
  try {
    const res = await fetch('https://streamtp99a.sbs/events.json?nocache=' + Date.now(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://streamtp99a.sbs/',
        'Accept': 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(6000)
    })
    if (!res.ok) return []
    const data = await res.json()
    const flattened: any[] = []
    if (Array.isArray(data)) {
      data.forEach((ev: any) => {
        flattened.push({
          title: ev.title,
          time: ev.time,
          category: ev.category,
          link: ev.url || ev.link,
          status: getStatusPorHorario(ev.time, ev.status)
        })
      })
    } else if (data && data.events && Array.isArray(data.events)) {
      data.events.forEach((ev: any) => {
        if (ev.links && Array.isArray(ev.links)) {
          ev.links.forEach((l: any) => {
            flattened.push({
              title: ev.title,
              time: ev.time,
              category: ev.category,
              link: l.url || l.link,
              status: getStatusPorHorario(ev.time, l.status || ev.status)
            })
          })
        }
      })
    }
    return flattened
  } catch (e) {
    return []
  }
}

const getStreamId = (url: string) => {
  if (!url) return ''
  try {
    const u = new URL(url)
    return u.searchParams.get('stream') || u.searchParams.get('channel') || url
  } catch {
    const match = url.match(/(stream|channel)=([^&]+)/)
    return match ? match[2] : url
  }
}

const getMatchTeams = (title: string) => {
  if (!title) return ''
  const parts = title.split(':')
  return parts.length > 1 ? parts[1].toLowerCase().trim() : title.toLowerCase().trim()
}

export async function GET() {
  try {
    const [streamXEvents, streamTpEvents] = await Promise.all([
      fetchStreamX(),
      fetchStreamTP()
    ])

    // streamx723 es ahora el principal
    let merged = streamXEvents && streamXEvents.length > 0 ? [...streamXEvents] : []

    if (merged.length === 0 && streamTpEvents && streamTpEvents.length > 0) {
      // Fallback: Si streamx723 falla, armamos la agenda exclusivamente con streamtp
      const uniqueTp: any[] = []
      const seen = new Set()
      streamTpEvents.forEach((ev: any) => {
        const teams = getMatchTeams(ev.title)
        const streamId = getStreamId(ev.link)
        const key = `${teams}-${streamId}`
        if (!seen.has(key)) {
          seen.add(key)
          uniqueTp.push(ev)
        }
      })
      merged = uniqueTp
    } else if (merged.length > 0 && streamTpEvents && streamTpEvents.length > 0) {
      // Enriquecer streamXEvents con categorías más específicas de streamtp si hace falta (ej. si dice "Fútbol" o "Other")
      merged = merged.map((ev: any) => {
        const teams = getMatchTeams(ev.title)
        const matchingTp = streamTpEvents.filter((x: any) => getMatchTeams(x.title) === teams)
        
        if (matchingTp.length > 0) {
          const cat = matchingTp.find((x: any) => x.category && x.category !== 'Other' && x.category !== 'Fútbol')?.category
          if (cat && (!ev.category || ev.category === 'Other' || ev.category === 'Fútbol')) {
            ev.category = cat
          }
          // Si streamtp marca el partido como "finalizado", asegurar que esté finalizado
          const tpFinished = matchingTp.some((x: any) => x.status === 'finalizado')
          if (tpFinished) {
            ev.status = 'finalizado'
          } else {
            // Si streamtp marca el partido explícitamente en "en vivo", asegurar que esté en vivo
            const tpLive = matchingTp.some((x: any) => x.status === 'en vivo')
            if (tpLive) {
              ev.status = 'en vivo'
            }
          }
        }
        return ev
      })
    }
    
    // Ordenar: primero 'en vivo', luego 'próximo' (por horario), y al final 'finalizado'
    const getPrio = (status: string) => {
      if (status === 'en vivo') return 1
      if (status === 'próximo') return 2
      return 3 // finalizado
    }
    merged = merged.sort((a, b) => {
      const pa = getPrio(a.status)
      const pb = getPrio(b.status)
      if (pa !== pb) return pa - pb
      return (a.time || '').localeCompare(b.time || '')
    })

    if (merged.length === 0) {
      throw new Error('No se encontraron eventos en ninguna fuente.')
    }

    return NextResponse.json(merged, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'No se pudo cargar la agenda', detail: error.message },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    )
  }
}
