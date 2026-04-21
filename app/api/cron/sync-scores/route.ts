import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { fetchEspnEventSummary } from '@/lib/espn'

export const dynamic = 'force-dynamic' // No cachear

export async function GET(request: Request) {
  // Buscamos partidos que no esten finalizados pero que tengan un espn_id guardado
  const { data: partidos, error } = await supabaseAdmin()
    .from('partidos')
    .select('id, estado, metadata, equipo_local, equipo_visitante')
    .neq('estado', 'FINALIZADO')
    .not('metadata->espn_id', 'is', 'null')

  if (error || !partidos || partidos.length === 0) {
    return NextResponse.json({ message: 'No hay partidos en curso vinculados', count: 0 })
  }

  const actualizados: string[] = []

  // Recorremos y pedimos la actualización
  for (const partido of partidos) {
    const espnId = partido.metadata?.espn_id
    if (!espnId) continue

    const espnData = await fetchEspnEventSummary(espnId)
    if (!espnData) continue // No lo encontro o falla temporal

    const home = espnData.competitors?.find(c => c.homeAway === 'home')
    const away = espnData.competitors?.find(c => c.homeAway === 'away')

    if (!home || !away) continue

    // Convert variables
    const gol_local = parseInt(home.score || '0', 10)
    const gol_visitante = parseInt(away.score || '0', 10)

    // Tiempo de juego (ej. "45'", "22'")
    // Status. ESPN usa STATUS_FULL_TIME, STATUS_IN_PROGRESS, STATUS_HALFTIME, STATUS_SCHEDULED, etc.
    const clock = espnData.status.displayClock
    const stateName = espnData.status.type.name
    
    let nuevoEstado = partido.estado
    if (stateName === 'STATUS_FULL_TIME' || stateName === 'STATUS_CANCELED' || stateName === 'STATUS_POSTPONED') {
      nuevoEstado = 'FINALIZADO'
    } else if (stateName === 'STATUS_IN_PROGRESS' || stateName === 'STATUS_HALFTIME') {
      nuevoEstado = 'EN-VIVO'
    }

    // Actualizamos metadata sumando el reloj
    const newMetadata = {
       ...partido.metadata,
       reloj: clock,
       periodo: espnData.status.period
    }

    await supabaseAdmin()
      .from('partidos')
      .update({
        gol_local,
        gol_visitante,
        estado: nuevoEstado,
        metadata: newMetadata
      })
      .eq('id', partido.id)

    actualizados.push(partido.id)
  }

  if (actualizados.length > 0) {
    revalidatePath('/', 'layout')
  }

  return NextResponse.json({ 
    message: 'Sync OK', 
    partidos_chequeados: partidos.length,
    partidos_actualizados: actualizados.length,
    ids: actualizados 
  })
}
