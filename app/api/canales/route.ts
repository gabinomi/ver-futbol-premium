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
    const parsedChannels: { id: string; name: string; url: string; image: string }[] = []
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

    // Lista blanca estricta: solo estos canales se muestran, en este orden exacto
    const WHITELIST = [
      'espn', 'espn2', 'espn3', 'espnpremium',
      'fox1ar', 'fox2ar', 'fox3ar',
      'tycsports', 'tycinternacional',
      'dsports', 'dsports2', 'dsportsplus',
      'tntsports', 'futv', 'telefe'
    ]

    // Filtrar solo los de la whitelist y ordenarlos según el orden de la lista
    const filteredChannels = WHITELIST
      .map(wlId => parsedChannels.find(c => c.id === wlId))
      .filter((c): c is NonNullable<typeof c> => c !== undefined)

    return NextResponse.json({ canales: filteredChannels }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200'
      }
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
