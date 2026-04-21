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
    
    for (const ev of events) {
      const home = ev.competitors?.find(c => c.homeAway === 'home')?.team
      const away = ev.competitors?.find(c => c.homeAway === 'away')?.team
      
      if (home?.displayName && home?.logo && coincide(home.displayName, name)) {
        return NextResponse.json({ url: home.logo })
      }
      if (away?.displayName && away?.logo && coincide(away.displayName, name)) {
        return NextResponse.json({ url: away.logo })
      }
    }
    
    return NextResponse.json({ url: null })
  } catch (error) {
    return NextResponse.json({ url: null })
  }
}
