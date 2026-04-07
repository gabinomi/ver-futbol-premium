import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://streamtpnew.com/eventos.json', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://streamtpnew.com/',
        'Accept': 'application/json',
      },
      cache: 'no-store', // Siempre datos frescos, sin caché de Next.js
    })

    if (!res.ok) {
      throw new Error(`StreamTP error: ${res.status}`)
    }
    
    // Parse JSON
    const data = await res.json()

    return NextResponse.json(data, {
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
