'use client'
import { useState, useEffect } from 'react'
import { Play, Clock, X } from 'lucide-react'
import { utcToArg, detectarBandera, parsearTitulo } from '@/lib/flags'
import Link from 'next/link'

interface Evento {
  title: string
  time: string
  category: string
  status: string
  link: string
}

export default function GlobalFABs() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [openPanel, setOpenPanel] = useState<'live' | 'next' | null>(null)

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await fetch('/api/eventos', { cache: 'no-store' })
        const data = await res.json()
        if (!data.error) setEventos(data)
      } catch (err) {
        console.error('Error fetching eventos for FABs', err)
      }
    }
    fetchEventos()
    const int = setInterval(fetchEventos, 120_000)
    return () => clearInterval(int)
  }, [])

  // Filtrar y agrupar
  const gruposMap: Record<string, { title: string, time: string, status: string, links: string[] }> = {}
  eventos.forEach(e => {
    const key = `${e.title}|${e.time}`
    if (!gruposMap[key]) {
      gruposMap[key] = { title: e.title, time: e.time, status: e.status, links: [] }
    }
    gruposMap[key].links.push(e.link)
  })

  const listaGrupos = Object.values(gruposMap).sort((a, b) => a.time.localeCompare(b.time))

  const enVivo = listaGrupos.filter(g => g.status === 'en vivo')
  
  // Próximos: status no en vivo Y <= 15 mins (y no muy viejo)
  const proximos = listaGrupos.filter(g => {
    if (g.status === 'en vivo') return false
    const [h, m] = g.time.split(':').map(Number)
    const eventTime = new Date()
    eventTime.setUTCHours(h, m, 0, 0)
    
    // Si el evento ya pasó hace mucho (ej: horas), no lo mostramos como próximo
    const diffMs = eventTime.getTime() - Date.now()
    const diffMins = diffMs / 60000

    // Solo mostramos eventos que faltan <= 15 minutos para empezar (y no hayan pasado más de 120 mins)
    return diffMins <= 15 && diffMins > -120
  })

  const buildRedirUrl = (links: string[], title: string) => {
    const params = new URLSearchParams()
    params.set('url', links[0])
    params.set('t', title)
    params.set('img', 'https://i.imgur.com/NwU54jR.jpeg')
    if (links[1]) params.set('opt2', links[1])
    if (links[2]) params.set('opt3', links[2])
    if (links[3]) params.set('opt4', links[3])
    return `/embed?${params.toString()}`
  }

  if (enVivo.length === 0 && proximos.length === 0) return null

  return (
    <>
      <div className='fixed bottom-5 right-4 z-[9999] flex flex-col gap-2 items-end'>
        {enVivo.length > 0 && (
          <button
            onClick={() => setOpenPanel(openPanel === 'live' ? null : 'live')}
            className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full font-barlow text-[13px] font-black tracking-wide uppercase transition-all shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:scale-105 ${openPanel === 'live' ? 'bg-red-700 text-white border border-red-500' : 'bg-red-600/90 text-white border-none'}`}
          >
            <span className='w-1.5 h-1.5 rounded-full bg-white animate-blink block' />
            EN VIVO <span className='bg-black/30 px-2 py-0.5 rounded-full text-[11px]'>{enVivo.length}</span>
          </button>
        )}

        {proximos.length > 0 && (
          <button
            onClick={() => setOpenPanel(openPanel === 'next' ? null : 'next')}
            className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full font-barlow text-[13px] font-black tracking-wide uppercase transition-all shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:scale-105 ${openPanel === 'next' ? 'bg-blue-700 text-white border border-blue-500' : 'bg-blue-600/90 text-white border-none'}`}
          >
            <Clock size={14} />
            PRÓXIMOS <span className='bg-black/30 px-2 py-0.5 rounded-full text-[11px]'>{proximos.length}</span>
          </button>
        )}
      </div>

      {openPanel && (
        <div className='fixed bottom-[120px] md:bottom-[130px] right-4 z-[9998] w-[320px] max-w-[92vw] bg-[#0d1221] border border-white/10 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col max-h-[70vh]'>
          <div className='flex items-center justify-between mb-3'>
            <span className='font-barlow text-[15px] font-black uppercase text-white'>
              {openPanel === 'live' ? 'En Vivo Ahora' : 'Próximos Partidos'}
            </span>
            <button onClick={() => setOpenPanel(null)} className='text-slate-400 hover:text-white p-1 rounded-md bg-white/5 border border-white/10'>
              <X size={14} />
            </button>
          </div>

          <div className='flex flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar'>
            {(openPanel === 'live' ? enVivo : proximos).map((g, idx) => {
              const p = parsearTitulo(g.title)
              const hora = utcToArg(g.time)
              const flag = detectarBandera(g.title)
              const redirUrl = buildRedirUrl(g.links, g.title)

              return (
                <Link
                  key={idx}
                  href={redirUrl}
                  onClick={() => setOpenPanel(null)}
                  className='flex items-center gap-3 p-2.5 bg-white/[0.03] hover:bg-blue-600/10 border border-white/[0.06] hover:border-blue-500/40 rounded-xl transition-colors cursor-pointer group'
                >
                  <div className='font-barlow text-[15px] font-black text-slate-200 min-w-[46px]'>
                    {hora}
                  </div>
                  <div className='w-5 h-3.5 bg-center bg-no-repeat bg-contain rounded-sm flex-shrink-0' style={{ backgroundImage: `url(${flag})` }} />
                  <div className='flex-1 min-w-0'>
                    {p.liga && <div className='text-[9px] text-slate-500 tracking-[1px] uppercase truncate mb-0.5'>{p.liga}</div>}
                    <div className='font-barlow text-[13px] font-extrabold uppercase text-slate-200 truncate group-hover:text-blue-400 transition-colors'>{p.partido}</div>
                  </div>
                  <Play size={12} className='text-slate-500 group-hover:text-blue-400' />
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
