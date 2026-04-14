import { NextRequest, NextResponse } from 'next/server'
import { fetchEspnDailyScoreboard, matchEspnEvent } from '@/lib/espn'

export async function POST(req: NextRequest) {
  try {
    const { local, visitante } = await req.json()
    if (!local || !visitante) {
      return NextResponse.json({ error: 'Faltan equipos' }, { status: 400 })
    }

    const events = await fetchEspnDailyScoreboard()
    if (!events || events.length === 0) {
      return NextResponse.json({ error: 'No hay partidos en ESPN listados hoy.' }, { status: 404 })
    }

    const matchedId = matchEspnEvent(local, visitante, events)
    if (matchedId) {
      return NextResponse.json({ espn_id: matchedId })
    } else {
      return NextResponse.json({ error: 'No se encontró partido similar en ESPN hoy.' }, { status: 404 })
    }

  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor buscando en ESPN' }, { status: 500 })
  }
}
