import { NextResponse } from 'next/server'

async function fetchStreamTP() {
  try {
    const res = await fetch('https://streamtpnew.com/eventos.json', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://streamtpnew.com/',
        'Accept': 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(6000)
    })
    if (!res.ok) return []
    return await res.json()
  } catch (e) {
    return []
  }
}

async function fetchTvLibr3() {
  try {
    const res = await fetch('https://tvlibr3.com/agenda/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(6000)
    })
    if (!res.ok) return []
    
    const data = await res.text()
    const regex = /<li class="[^"]+">\s*<a href="#">\s*([^<]+)\s*<span class="t">([^<]+)<\/span><\/a>\s*<ul>([\s\S]*?)<\/ul>\s*<\/li>/g;
    let match;
    const eventos = [];
    
    while ((match = regex.exec(data)) !== null) {
      const title = match[1].trim();
      const time = match[2].trim();
      const optionsHtml = match[3];
      
      const optionsRegex = /<a href="([^"]+)"[^>]*>([^<]+)<span>([^<]*)<\/span><\/a>/g;
      let optMatch;
      while ((optMatch = optionsRegex.exec(optionsHtml)) !== null) {
        let url = optMatch[1]
        if (url.includes('/eventos/?r=')) {
          try {
            url = Buffer.from(url.split('?r=')[1], 'base64').toString('utf8')
          } catch(e) {}
        } else if (url.startsWith('/en-vivo/')) {
          let cid = url.replace('/en-vivo/', '').replace(/\//g, '').replace(/-/g, '')
          url = `https://streamtpnew.com/global1.php?stream=${cid}`
        }
        eventos.push({ title, time, link: url, status: 'pronto' }); // flat structure
      }
    }
    return eventos
  } catch (e) {
    return []
  }
}

async function fetchStreamX550() {
  try {
    const res = await fetch('https://streamx550.com/json/agenda550.json?nocache=' + Date.now(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(6000)
    })
    if (!res.ok) return []
    const rawData = await res.json()
    
    return rawData.map((item: any) => {
      let normalizedLink = item.link || ''
      if (normalizedLink.includes('channel=')) {
        normalizedLink = normalizedLink.replace('channel=', 'stream=')
      }
      return {
        ...item,
        link: normalizedLink
      }
    })
  } catch (e) {
    return []
  }
}

export async function GET() {
  try {
    const [streamTpEvents, tvLibr3Events, x550Events] = await Promise.all([
      fetchStreamTP(),
      fetchTvLibr3(),
      fetchStreamX550()
    ])

    let merged = [...(streamTpEvents || [])]

    // Función auxiliar para buscar evento en x550 y obtener su categoría y status
    const findInX550 = (title: string) => {
      if (!Array.isArray(x550Events)) return null
      return x550Events.find((x: any) => x.title?.toLowerCase().trim() === title?.toLowerCase().trim())
    }

    // 1. Enriquecer streamTpEvents con categorías de x550
    merged = merged.map((ev: any) => {
      const found = findInX550(ev.title)
      if (found && found.category && (!ev.category || ev.category === 'Other')) {
        ev.category = found.category
      }
      return ev
    })

    // 2. Añadir eventos/links de tvlibr3 que NO estén en merged
    if (Array.isArray(tvLibr3Events)) {
      tvLibr3Events.forEach((ev: any) => {
        const foundCategory = findInX550(ev.title)?.category || 'Other'
        const existsLink = merged.find((m: any) => 
          m.title?.toLowerCase().trim() === ev.title?.toLowerCase().trim() && 
          m.link === ev.link
        )
        if (!existsLink) {
          merged.push({ ...ev, category: foundCategory })
        }
      })
    }

    // 3. Añadir eventos/links exclusivos de x550 que NO estén
    if (Array.isArray(x550Events)) {
      x550Events.forEach((ev: any) => {
        const existsLink = merged.find((m: any) => 
          m.title?.toLowerCase().trim() === ev.title?.toLowerCase().trim() && 
          m.link === ev.link
        )
        if (!existsLink) {
          merged.push(ev)
        }
      })
    }
    
    // Sort by time
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
