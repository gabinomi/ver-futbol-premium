'use client'
import { useEffect, useState, useRef } from 'react'
import { utcToArg, detectarBandera, parsearTitulo, esFutbolReal } from '@/lib/flags'
import { Play, Star } from 'lucide-react'
import Link from 'next/link'
import GlobalNav from '@/components/public/GlobalNav'
import { CANALES, BASE_JW } from '@/lib/canales-data'

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

const IMG_DEFAULT = 'https://i.imgur.com/NwU54jR.jpeg'
const DURACION = 5
const MSGS = [
  'El botón se activa al finalizar',
  'Preparando la transmisión...',
  'Verificando disponibilidad...',
  'Listo para reproducir'
]

export default function CalendarioPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(false)
  const [filtro, setFiltro] = useState<'futbol' | 'todos'>('futbol')
  const [openId, setOpenId] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const [playerSrc, setPlayerSrc] = useState('')
  const [playerTitle, setPlayerTitle] = useState('')
  const [remaining, setRemaining] = useState(DURACION)
  const [done, setDone] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const playerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startContador = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setRemaining(DURACION)
    setDone(false)
    setShowPlayer(false)
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(intervalRef.current!)
          setDone(true)
          return 0
        }
        return r - 1
      })
    }, 1000)
  }

  const reproducir = (url: string, title: string) => {
    setPlayerSrc(url)
    setPlayerTitle(title)
    startContador()
    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const fetchEventos = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(false)
    try {
      // cache: no-store fuerza siempre datos frescos sin importar el service worker o cache del browser
      const res = await fetch('/api/eventos', { cache: 'no-store' })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setEventos(data)
      setLastUpdate(new Date())
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchEventos()
    // Auto-actualizar cada 2 minutos
    const interval = setInterval(() => fetchEventos(true), 120_000)
    return () => clearInterval(interval)
  }, [])

  // Procesamiento
  const filtrados = filtro === 'futbol' 
    ? eventos.filter(e => e.category === 'Fútbol' || e.category === 'Fútbol_cup' || e.category === 'Futbol' || esFutbolReal(e.title))
    : eventos.filter(e => !(e.category === 'Fútbol' || e.category === 'Fútbol_cup' || e.category === 'Futbol' || esFutbolReal(e.title)))

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
    <div className='relative z-10 flex flex-col min-h-screen'>
      <GlobalNav />
      <main className='max-w-[1400px] w-full mx-auto px-4 py-6 flex flex-col flex-1'>
        <div className='flex justify-center mb-6'>
        <div className='w-full max-w-[728px] h-[90px] bg-white/5 rounded-lg flex items-center justify-center text-white/20 text-xs tracking-widest uppercase'>Banner 728×90</div>
      </div>

      {/* ═══ REPRODUCTOR INLINE ═══ */}
      {playerSrc && (
        <div ref={playerRef} className='mb-8 max-w-[1000px] w-full mx-auto bg-[#0a0f1c] rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 animate-fade-in'>
          <div className='bg-gradient-to-r from-[#0d2860] to-[#1a3a9a] px-5 py-3 border-b border-white/10 flex items-center justify-between'>
            <h2 className='font-barlow text-lg font-black uppercase text-white tracking-wide truncate pr-4'>{playerTitle}</h2>
            <button onClick={() => setPlayerSrc('')} className='text-[10px] uppercase font-bold tracking-widest text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 px-3 py-1.5 rounded-lg border border-white/10'>
              Cerrar
            </button>
          </div>
          
          <div className='p-4 md:p-6'>
            {!showPlayer ? (
              <div className='flex flex-col gap-6 max-w-[600px] mx-auto'>
                <div className='bg-black/40 rounded-xl px-5 py-4 border border-white/5 flex items-center gap-5'>
                  <div className='relative w-16 h-16 flex-shrink-0'>
                    <svg className='w-16 h-16 -rotate-90' viewBox='0 0 80 80'>
                      <circle cx='40' cy='40' r='32' fill='none' stroke='rgba(255,255,255,0.06)' strokeWidth='5' />
                      <circle cx='40' cy='40' r='32' fill='none'
                        stroke={remaining <= 3 ? '#2563eb' : '#dc2626'}
                        strokeWidth='5' strokeLinecap='round'
                        strokeDasharray={2 * Math.PI * 32}
                        strokeDashoffset={(2 * Math.PI * 32) * (1 - (DURACION - remaining) / DURACION)}
                        style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
                      />
                    </svg>
                    <div className='absolute inset-0 flex items-center justify-center font-barlow text-2xl font-black text-white'>
                      {done ? '✓' : remaining}
                    </div>
                  </div>
                  <div className='flex-1 flex flex-col gap-2'>
                    <p className='text-xs text-slate-400 font-bold uppercase tracking-widest'>
                      {done ? '¡Listo! Tocá el botón para ver' : MSGS[Math.floor(((DURACION - remaining) / DURACION) * (MSGS.length - 1))]}
                    </p>
                    <div className='w-full h-1.5 bg-white/5 rounded-full overflow-hidden'>
                      <div className='h-full bg-gradient-to-r from-red-600 to-blue-600 rounded-full origin-left transition-transform duration-1000 linear'
                        style={{ transform: `scaleX(${1 - (remaining / DURACION)})` }} />
                    </div>
                    <p className='text-[10px] text-slate-500 uppercase tracking-wider'>
                      {done ? 'Transmisión lista' : `Espera ${remaining}s para activar`}
                    </p>
                  </div>
                </div>
                
                <div
                  className={`relative rounded-xl overflow-hidden bg-black aspect-video select-none border border-white/10 ${done ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => {
                    if (done) {
                      window.open('https://www.profitablecpmratenetwork.com/uj4jq7sxqb?key=e28e0a5ffc1f8cbc53e1375887ec3644', '_blank')
                      setShowPlayer(true)
                    }
                  }}
                >
                  <img src={IMG_DEFAULT} alt='Thumb' className='w-full h-full object-cover opacity-75' />
                  <div className='absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/35 hover:bg-black/50 transition-colors'>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-[3px] shadow-[0_0_40px_rgba(37,99,235,0.6)] transition-transform duration-200 ${done ? 'bg-blue-600/85 border-white/90 scale-100 hover:scale-110' : 'bg-slate-700/50 border-slate-500/50 scale-90 grayscale opacity-60'}`}>
                      <Play fill='currentColor' className='text-white w-7 h-7 ml-1' />
                    </div>
                    <div className='font-barlow text-sm font-extrabold tracking-[2px] uppercase text-white/85'>
                      {done ? 'Tocá para ver el partido' : 'Esperando tiempo...'}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    window.open('https://www.profitablecpmratenetwork.com/uj4jq7sxqb?key=e28e0a5ffc1f8cbc53e1375887ec3644', '_blank')
                    setShowPlayer(true)
                  }}
                  disabled={!done}
                  className={`relative flex items-center justify-center gap-2 w-full py-4 rounded-xl font-barlow text-lg font-black tracking-[1px] uppercase transition-all duration-300 ${
                    done
                      ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-[0_6px_25px_rgba(37,99,235,0.3)] hover:scale-[1.02]'
                      : 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-white/5'
                  }`}>
                  <Play size={18} className='flex-shrink-0' fill={done ? 'currentColor' : 'none'} />
                  Ver transmisión en vivo
                </button>
              </div>
            ) : (
              <div className='relative w-full rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]' style={{ aspectRatio: '16/9' }}>
                <iframe 
                  key={playerSrc}
                  src={playerSrc.includes('streamtp') || playerSrc.includes('tvlibr3') ? playerSrc : `/embed?url=${encodeURIComponent(playerSrc)}`}
                  className='absolute inset-0 w-full h-full border-none bg-black'
                  allowFullScreen
                  scrolling='no'
                  referrerPolicy='no-referrer'
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className='flex gap-5 items-start justify-center'>
        <aside className='hidden xl:block w-40 flex-shrink-0 sticky top-6'>
          <div className='w-40 h-[600px] bg-white/5 rounded-xl flex items-center justify-center text-white/20 text-xs tracking-widest'>160×600</div>
        </aside>

        <div className='flex-1 max-w-[860px] flex flex-col gap-4'>
          {/* Header Agenda */}
          <div className='flex items-center gap-3 px-1 flex-wrap'>
            <h1 className='font-barlow text-xl font-black uppercase tracking-wide text-white'>Agenda Deportiva</h1>
            <div className='flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/15 border border-red-600/50 text-red-500 text-[10px] font-bold tracking-widest uppercase'>
              <span className='w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse' />
              EN VIVO
            </div>
            {lastUpdate && (
              <span className='text-[10px] text-slate-600 ml-auto'>
                Act. {lastUpdate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          {/* Filtros + Actualizar */}
          <div className='flex flex-wrap gap-2 items-center'>
            <button
              onClick={() => setFiltro('futbol')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-barlow text-[13px] font-bold uppercase tracking-wide transition-colors ${filtro === 'futbol' ? 'bg-blue-600/20 text-blue-400 border border-blue-600' : 'bg-white/5 text-slate-400 border border-white/10'}`}>
              Solo Fútbol
            </button>
            <button
              onClick={() => setFiltro('todos')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-barlow text-[13px] font-bold uppercase tracking-wide transition-colors ${filtro === 'todos' ? 'bg-blue-600/20 text-blue-400 border border-blue-600' : 'bg-white/5 text-slate-400 border border-white/10'}`}>
              Otros Deportes
            </button>
            {/* Botón Actualizar */}
            <button
              onClick={() => fetchEventos(true)}
              disabled={refreshing || loading}
              className='ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-barlow text-[13px] font-bold uppercase tracking-wide border border-emerald-600/40 bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
              {refreshing ? (
                <svg className='w-3.5 h-3.5 animate-spin' fill='none' viewBox='0 0 24 24'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/><path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'/></svg>
              ) : (
                <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' /></svg>
              )}
              Actualizar
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
                  <div key={id} className={`bg-[#081024e6] border rounded-[12px] overflow-hidden transition-all duration-200 ${esVivo ? 'border-red-600/50 shadow-[0_0_16px_rgba(220,38,38,0.1)]' : 'border-white/5 hover:border-blue-600/40 hover:shadow-[0_4px_20px_rgba(37,99,235,0.1)]'}`}>
                    <div className='flex items-center gap-3 px-4 py-3 cursor-pointer select-none' onClick={() => togglePartido(id)}>
                      <div className='font-barlow text-[15px] font-black text-slate-200 w-11 flex-shrink-0 tracking-wide'>
                        {horaArg}
                        <span className='block text-[8px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5'>ARG</span>
                      </div>
                      
                      <div className='w-6 h-4 flex-shrink-0 bg-center bg-no-repeat bg-contain rounded-sm' style={{ backgroundImage: `url(${bandera})` }} />
                      
                      <div className='flex-1 min-w-0'>
                        {parsed.liga && <div className='text-[9px] font-semibold tracking-[1px] uppercase text-slate-500 mb-0.5 truncate'>{parsed.liga}</div>}
                        <div className='font-barlow text-[14px] font-extrabold uppercase tracking-wide text-slate-200 leading-tight truncate'>{parsed.partido}</div>
                      </div>

                      <div className='flex flex-col items-end gap-1 flex-shrink-0'>
                        {esVivo ? (
                          <div className='flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/15 border border-red-600/50 text-red-500 text-[8px] font-bold tracking-widest uppercase'>
                            <span className='w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse' /> EN VIVO
                          </div>
                        ) : (
                          <div className='flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-600/12 border border-blue-600/50 text-blue-400 text-[8px] font-bold tracking-widest uppercase'>
                            PRONTO
                          </div>
                        )}
                        <svg className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-200 mt-0.5 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>

                    {/* Expandible (Opciones) */}
                    {isOpen && (
                      <div className='flex flex-wrap gap-2 px-4 py-3 border-t border-white/5 bg-[#02081080]'>
                        {g.links.map((link, i) => {
                          let streamName = link.split('stream=')[1] || `Opción ${i+1}`
                          streamName = streamName.replace(/_/g, ' ').toUpperCase()
                          const isPrimary = i === 0
                          const urlOpt = isPrimary ? link : link // actually we just need the link itself
                          // Buscar si el link corresponde a un canal con HD
                          const sid = (link.split('stream=')[1] || '').toLowerCase()
                          const canalHD = CANALES.find(c => c.hd && c.enlace.toLowerCase().includes(sid))
                          const hdUrl = canalHD && canalHD.hd ? (BASE_JW + canalHD.hd) : null

                          return (
                            <div key={i} className='flex flex-wrap gap-2 w-full'>
                              {hdUrl && (
                                <div className='w-full mb-1 bg-yellow-500/10 border border-yellow-500/20 p-2 rounded-lg flex flex-col items-start'>
                                  <span className='text-[9px] font-bold tracking-[2px] uppercase text-yellow-600 mb-1.5 flex items-center gap-1'><Star size={10} /> Versión Premium</span>
                                  <button onClick={() => reproducir(hdUrl, g.title)} className='inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-barlow text-[13px] font-bold tracking-wide uppercase transition-all bg-gradient-to-br from-yellow-500 to-yellow-600 text-black shadow-[0_4px_14px_rgba(234,179,8,0.25)] hover:scale-[1.02]'>
                                    <Star className='w-3 h-3' fill='currentColor' />
                                    {streamName} <span className='bg-black text-yellow-500 text-[8px] font-black px-1 rounded ml-1'>HD</span>
                                  </button>
                                </div>
                              )}
                              
                              <button onClick={() => reproducir(link, g.title)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-barlow text-[13px] font-bold tracking-wide uppercase transition-colors ${isPrimary ? 'bg-gradient-to-br from-blue-600 to-[#1a3ab8] text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)]' : 'bg-blue-600/10 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30 hover:text-white'}`}>
                                <Play className='w-3 h-3' fill={isPrimary ? 'currentColor' : 'none'} />
                                {isPrimary ? streamName : `Opción ${i+1} — ${streamName}`}
                              </button>
                              
                              {/* Opciones extra (Bolaloca, Welivesports, etc) */}
                              {isPrimary && canalHD?.options?.map((opt, idx) => (
                                <button key={`opt-${idx}`} onClick={() => reproducir(opt.url, g.title)} className='inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-barlow text-[13px] font-bold tracking-wide uppercase transition-colors bg-purple-600/10 text-purple-400 border border-purple-600/30 hover:bg-purple-600/30 hover:text-white'>
                                  <Play className='w-3 h-3' fill='none' />
                                  {opt.name}
                                </button>
                              ))}
                            </div>
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
    </div>
  )
}
