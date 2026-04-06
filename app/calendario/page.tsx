'use client'
import { useEffect, useState } from 'react'
import { utcToArg, detectarBandera, parsearTitulo } from '@/lib/flags'
import { Play } from 'lucide-react'
import Link from 'next/link'

interface Evento {
  title: string
  time: string
  category: string
  status: string
  link: string
  language: string
}

interface PartidoGrupo {
  title: string
  time: string
  status: string
  links: string[]
}

const IMG_DEFAULT = 'https://i.imgur.com/9S9J4O0.jpeg'

export default function CalendarioPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filtro, setFiltro] = useState<'futbol' | 'todos'>('futbol')
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/eventos')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setEventos(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError(true)
        setLoading(false)
      })
  }, [])

  // Procesamiento
  const filtrados = filtro === 'futbol' 
    ? eventos.filter(e => e.category === 'Fútbol' || e.category === 'Fútbol_cup' || e.category === 'Futbol')
    : eventos

  const gruposMap: Record<string, PartidoGrupo> = {}
  filtrados.forEach(e => {
    const key = `${e.title}|${e.time}`
    if (!gruposMap[key]) {
      gruposMap[key] = { title: e.title, time: e.time, status: e.status, links: [] }
    }
    gruposMap[key].links.push(e.link)
  })

  const listaGrupos = Object.values(gruposMap).sort((a, b) => a.time.localeCompare(b.time))

  const buildRedirUrl = (links: string[], title: string, img: string) => {
    const params = new URLSearchParams()
    params.set('url', links[0])
    params.set('t', title)
    params.set('img', img)
    if (links[1]) params.set('opt2', links[1])
    if (links[2]) params.set('opt3', links[2])
    if (links[3]) params.set('opt4', links[3])
    return `/embed?${params.toString()}`
  }

  const togglePartido = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <main className='relative z-10 flex flex-col min-h-screen max-w-[1400px] mx-auto px-4 py-6'>
      <div className='flex justify-center mb-6'>
        <div className='w-full max-w-[728px] h-[90px] bg-white/5 rounded-lg flex items-center justify-center text-white/20 text-xs tracking-widest uppercase'>Banner 728×90</div>
      </div>

      <div className='flex gap-5 items-start justify-center'>
        <aside className='hidden xl:block w-40 flex-shrink-0 sticky top-6'>
          <div className='w-40 h-[600px] bg-white/5 rounded-xl flex items-center justify-center text-white/20 text-xs tracking-widest'>160×600</div>
        </aside>

        <div className='flex-1 max-w-[860px] flex flex-col gap-4'>
          {/* Header Agenda */}
          <div className='flex items-center gap-3 px-1'>
            <h1 className='font-barlow text-2xl font-black uppercase tracking-wide text-white'>Agenda Deportiva</h1>
            <div className='flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/15 border border-red-600/50 text-red-500 text-[10px] font-bold tracking-widest uppercase'>
              <span className='w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse' />
              EN VIVO
            </div>
          </div>

          {/* Filtros */}
          <div className='flex flex-wrap gap-2'>
            <button 
              onClick={() => setFiltro('futbol')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-barlow text-[14px] font-bold uppercase tracking-wide transition-colors ${filtro === 'futbol' ? 'bg-blue-600/20 text-blue-400 border border-blue-600' : 'bg-white/5 text-slate-400 border border-white/10'}`}>
              Solo Fútbol
            </button>
            <button 
              onClick={() => setFiltro('todos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-barlow text-[14px] font-bold uppercase tracking-wide transition-colors ${filtro === 'todos' ? 'bg-blue-600/20 text-blue-400 border border-blue-600' : 'bg-white/5 text-slate-400 border border-white/10'}`}>
              Todos
            </button>
          </div>

          {/* Lista */}
          <div className='flex flex-col gap-3 mt-2 mb-6'>
            {loading ? (
              <div className='text-center py-20 text-slate-500 font-barlow tracking-wider'>
                Cargando partidos del día...
              </div>
            ) : error ? (
              <div className='text-center py-20 text-red-400 font-barlow tracking-wider'>
                No se pudo cargar la agenda. Intentá recargar la página.
              </div>
            ) : listaGrupos.length === 0 ? (
              <div className='text-center py-20 text-slate-500 font-barlow tracking-wider'>
                No hay partidos disponibles hoy
              </div>
            ) : (
              listaGrupos.map((g, idx) => {
                const id = `${g.title}-${g.time}-${idx}`
                const parsed = parsearTitulo(g.title)
                const horaArg = utcToArg(g.time)
                const bandera = detectarBandera(g.title)
                const esVivo = g.status === 'en vivo'
                const isOpen = openId === id

                return (
                  <div key={id} className={`bg-[#081024e6] border rounded-xl overflow-hidden transition-all duration-200 ${esVivo ? 'border-red-600/50 shadow-[0_0_16px_rgba(220,38,38,0.1)]' : 'border-white/5 hover:border-blue-600/40 hover:shadow-[0_4px_20px_rgba(37,99,235,0.1)]'}`}>
                    <div className='flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none' onClick={() => togglePartido(id)}>
                      <div className='font-barlow text-lg font-black text-slate-200 w-12 flex-shrink-0 tracking-wide'>
                        {horaArg}
                        <span className='block text-[9px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5'>ARG</span>
                      </div>
                      
                      <div className='w-7 h-5 flex-shrink-0 bg-center bg-no-repeat bg-contain rounded-sm' style={{ backgroundImage: `url(${bandera})` }} />
                      
                      <div className='flex-1 min-w-0'>
                        {parsed.liga && <div className='text-[10px] font-semibold tracking-[1.5px] uppercase text-slate-500 mb-0.5 truncate'>{parsed.liga}</div>}
                        <div className='font-barlow text-[17px] font-extrabold uppercase tracking-wide text-slate-200 leading-tight truncate'>{parsed.partido}</div>
                      </div>

                      <div className='flex flex-col items-end gap-1 flex-shrink-0'>
                        {esVivo ? (
                          <div className='flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/15 border border-red-600/50 text-red-500 text-[9px] font-bold tracking-widest uppercase'>
                            <span className='w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse' /> EN VIVO
                          </div>
                        ) : (
                          <div className='flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-600/12 border border-blue-600/50 text-blue-400 text-[9px] font-bold tracking-widest uppercase'>
                            PRONTO
                          </div>
                        )}
                        <svg className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>

                    {/* Expandible (Opciones) */}
                    {isOpen && (
                      <div className='flex flex-wrap gap-2 px-4 py-3 border-t border-white/5 bg-[#02081080]'>
                        {g.links.map((link, i) => {
                          let streamName = link.split('stream=')[1] || `Opción ${i+1}`
                          streamName = streamName.replace(/_/g, ' ').toUpperCase()
                          
                          const sliceLinks = [link, ...g.links.filter(l => l !== link)]
                          const redirUrl = buildRedirUrl(sliceLinks.slice(0, 4), g.title, IMG_DEFAULT)
                          
                          const isPrimary = i === 0
                          
                          return (
                            <Link key={i} href={redirUrl} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-barlow text-[13px] font-bold tracking-wide uppercase transition-colors ${isPrimary ? 'bg-gradient-to-br from-blue-600 to-[#1a3ab8] text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)]' : 'bg-blue-600/10 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30 hover:text-white'}`}>
                              <Play className='w-3 h-3' fill={isPrimary ? 'currentColor' : 'none'} />
                              {isPrimary ? streamName : `Opción ${i+1} — ${streamName}`}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        <aside className='hidden xl:block w-40 flex-shrink-0 sticky top-6'>
          <div className='w-40 h-[600px] bg-white/5 rounded-xl flex items-center justify-center text-white/20 text-xs tracking-widest'>160×600</div>
        </aside>
      </div>

      <div className='flex justify-center mt-auto py-4'>
        <div className='w-full max-w-[728px] h-[90px] bg-white/5 rounded-lg flex items-center justify-center text-white/20 text-xs tracking-widest uppercase'>Banner 728×90</div>
      </div>
    </main>
  )
}
