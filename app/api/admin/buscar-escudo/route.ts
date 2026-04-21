import { NextResponse } from 'next/server'
import { fetchEspnDailyScoreboard } from '@/lib/espn'
import { coincide } from '@/hooks/useLiveMatch'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('t')
  
  if (!name) return NextResponse.json({ url: null })

  try {
    const events = await fetchEspnDailyScoreboard()
    
    for (const ev of events as any[]) {
      // ESPN real structure: ev.competitions[0].competitors[]
      const comp = ev.competitions?.[0]
      const competitors = comp?.competitors || ev.competitors || []
      
      const home = competitors.find((c: any) => c.homeAway === 'home')
      const away = competitors.find((c: any) => c.homeAway === 'away')
      
      const homeName = home?.team?.displayName || home?.team?.name || ''
      const awayName = away?.team?.displayName || away?.team?.name || ''
      const homeLogo = home?.team?.logo || null
      const awayLogo = away?.team?.logo || null
      
      if (homeName && homeLogo && coincide(homeName, name)) {
        return NextResponse.json({ url: homeLogo })
      }
      if (awayName && awayLogo && coincide(awayName, name)) {
        return NextResponse.json({ url: awayLogo })
      }
    }
    
    return NextResponse.json({ url: null })
  } catch (error) {
    return NextResponse.json({ url: null })
  }
}
