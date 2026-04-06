import { NextResponse } from 'next/server'
import { getChannelMeta } from '@/lib/canales-logos'

export async function GET() {
  try {
    const res = await fetch('https://streamtpnew.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 600 } // Cache for 10 minutes
    })

    if (!res.ok) {
      throw new Error(`Error fetching streamtp: ${res.status}`)
    }

    const html = await res.text()

    // 1. Ubicar el objeto channels
    const channelsMatch = html.match(/const\s+channels\s*=\s*(\{[\s\S]*?\});/)
    if (!channelsMatch) {
      throw new Error('No se encontraron los canales en el HTML.')
    }

    const channelsBlock = channelsMatch[1]
    
    // 2. Extraer los datos seguros mediante regex
    const regex = /'([^']+)'\s*:\s*'([^']+)'/g
    const parsedChannels = []
    let match

    while ((match = regex.exec(channelsBlock)) !== null) {
      const parsedName = match[1]
      const url = match[2]
      
      // Intentar sacar el streamID para las imágenes
      const urlObj = new URL(url)
      const streamId = urlObj.searchParams.get('stream')

      if (streamId) {
        const meta = getChannelMeta(streamId, parsedName)
        parsedChannels.push({
          id: streamId,
          name: meta.name,
          url: url,
          image: meta.image
        })
      }
    }

    // Filtrar solo los canales que realmente queremos mostrar
    // (O todos, pero ordenados. En este caso dejaremos los más importantes primero o los definidos en nuestro metadata).
    // Para respetar el diseño del usuario (ESPN, FOX, TYC, TNT)
    const priorityIds = ['espn', 'espn2', 'espn3', 'espnpremium', 'fox1ar', 'fox2ar', 'fox3ar', 'tycsports', 'tycinternacional', 'dsportsplus', 'tntsports']
    
    const sortedChannels = parsedChannels.sort((a, b) => {
      const idxA = priorityIds.indexOf(a.id)
      const idxB = priorityIds.indexOf(b.id)
      if (idxA !== -1 && idxB !== -1) return idxA - idxB
      if (idxA !== -1) return -1
      if (idxB !== -1) return 1
      return a.name.localeCompare(b.name)
    })

    // Retorna sólo los más importantes (los del CSV de la imagen y otros si hace falta, pero dándole prioridad).
    // Tomaré el top (CSV indicaba unos 10 canales clave). Podríamos devolver todos.
    return NextResponse.json({ canales: sortedChannels }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200'
      }
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
