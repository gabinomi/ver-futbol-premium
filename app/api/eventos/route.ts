import { NextResponse } from 'next/server'

function getStatusPorHorario(timeStr: string): string {
  if (!timeStr || !timeStr.includes(':')) {
    return 'próximo'
  }
  
  let [h, m] = timeStr.split(':').map(Number)
  h = h + 2
  if (h >= 24) h -= 24
  
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
  const evMinutes = h * 60 + m
  
  let isLive = false
  if (h >= 21 && nowH <= 3) {
    isLive = (nowMinutes + 24 * 60) >= evMinutes
  } else if (h <= 3 && nowH >= 21) {
    isLive = false
  } else {
    isLive = nowMinutes >= evMinutes
  }
  
  return isLive ? 'en vivo' : 'próximo'
}

async function fetchStreamTP() {
  try {
    const res = await fetch('https://streamtp.sbs/wc.json?nocache=' + Date.now(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://streamtp.sbs/',
        'Accept': 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(6000)
    })
    if (!res.ok) return []
    const data = await res.json()
    const flattened: any[] = []
    if (data && data.events && Array.isArray(data.events)) {
      data.events.forEach((ev: any) => {
        if (ev.links && Array.isArray(ev.links)) {
          ev.links.forEach((l: any) => {
            flattened.push({
              title: ev.title,
              time: ev.time,
              category: ev.category,
              link: l.url,
              status: getStatusPorHorario(ev.time)
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

async function fetchStreamX550() {
  try {
    const res = await fetch('https://streamx996.one/json/agenda550.json?nocache=' + Date.now(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(6000)
    })
    if (!res.ok) return []
    const rawData = await res.json()
    if (Array.isArray(rawData)) {
      return rawData.map(ev => ({
        ...ev,
        status: getStatusPorHorario(ev.time)
      }))
    }
    return rawData
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
    const [streamTpEvents, x550Events] = await Promise.all([
      fetchStreamTP(),
      fetchStreamX550()
    ])

    // streamx996 es ahora el principal
    let merged = x550Events && x550Events.length > 0 ? [...x550Events] : []

    if (merged.length === 0 && streamTpEvents && streamTpEvents.length > 0) {
      // Fallback: Si streamx996 falla, armamos la agenda exclusivamente con streamtp
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
      // 1. Enriquecer streamx996Events con categorías de streamtp si hace falta
      merged = merged.map((ev: any) => {
        const teams = getMatchTeams(ev.title)
        const matchingTp = streamTpEvents.filter((x: any) => getMatchTeams(x.title) === teams)
        
        if (matchingTp.length > 0) {
          const cat = matchingTp.find((x: any) => x.category && x.category !== 'Other')?.category
          if (cat && (!ev.category || ev.category === 'Other')) {
            ev.category = cat
          }
        }
        return ev
      })
    }
    
    // Ordenar por hora
    merged = merged.sort((a, b) => (a.time || '').localeCompare(b.time || ''))

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
