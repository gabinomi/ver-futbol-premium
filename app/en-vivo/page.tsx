'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import GlobalNav from '@/components/public/GlobalNav'
import Image from 'next/image'
import Link from 'next/link'
import { CANALES, BASE_JW, getEnlaceHD, Canal } from '@/lib/canales-data'
import { detectarBandera, parsearTitulo, esFutbolReal } from '@/lib/flags'
import { Play, Star } from 'lucide-react'

// Reutilizamos la configuracion de Ligas para buscar los escudos
const LIGAS = [
  { slug: 'arg.1' }, { slug: 'arg.copa' }, { slug: 'conmebol.libertadores' }, { slug: 'conmebol.sudamericana' },
  { slug: 'esp.1' }, { slug: 'esp.2' }, { slug: 'uefa.champions' }, { slug: 'uefa.europa' },
  { slug: 'bra.1' }, { slug: 'col.1' }, { slug: 'mex.1' }, { slug: 'eng.1' }, { slug: 'ita.1' }, { slug: 'ger.1' }
]

const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/'

interface Evento {
  title: string
  time: string
  category: string
  status: string
  link: string
}

interface PartidoGrupo {
  title: string
  time: string
  status: string
  links: string[]
}

export default function EnVivoPage() {
  const [eventosLive, setEventosLive] = useState<PartidoGrupo[]>([])
  const [espnEvents, setEspnEvents] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  const cargarDatos = useCallback(async () => {
    setCargando(true)
    try {
      // 1. Fetch Agenda
      const resAgenda = await fetch('/api/eventos', { cache: 'no-store' })
      const dataAgenda: Evento[] = await resAgenda.json()
      
      const gruposMap: Record<string, PartidoGrupo> = {}
      dataAgenda.forEach(e => {
        if (e.status !== 'en vivo') return
        const key = `${e.title}|${e.time}`
        if (!gruposMap[key]) {
          gruposMap[key] = { title: e.title, time: e.time, status: e.status, links: [] }
        }
        gruposMap[key].links.push(e.link)
      })
      const liveGroups = Object.values(gruposMap).sort((a, b) => a.time.localeCompare(b.time))
      setEventosLive(liveGroups)

      // 2. Fetch ESPN solo para fútbol (para tratar de coincidir escudos)
      // Si hay eventos de fútbol en vivo, buscamos en ESPN
      const tieneFutbol = liveGroups.some(g => esFutbolReal(g.title))
      if (tieneFutbol) {
        const allEspn: any[] = []
        await Promise.all(
          LIGAS.map(async (liga) => {
            try {
              const res = await fetch(`${BASE_URL}${liga.slug}/scoreboard?limit=30`, { cache: 'no-store' })
              if (res.ok) {
                const data = await res.json()
                if (data.events) allEspn.push(...data.events)
              }
            } catch (e) {}
          })
        )
        setEspnEvents(allEspn)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarDatos()
    const intervalId = setInterval(cargarDatos, 60000) // cada minuto
    return () => clearInterval(intervalId)
  }, [cargarDatos])

  // Lógica Fuzzy Match
  const matchEventoConESPN = (titulo: string) => {
    const cleanTitle = titulo.toLowerCase().replace(/vs/g, '').replace(/[^a-z0-9\s]/g, '')
    const words = cleanTitle.split(/\s+/).filter(w => w.length >= 3)
    
    for (const ev of espnEvents) {
      const c1 = ev.competitions[0].competitors[0].team.name.toLowerCase()
      const c2 = ev.competitions[0].competitors[1].team.name.toLowerCase()
      const ew = (c1 + ' ' + c2).split(/\s+/).filter(w => w.length >= 3)
      
      let matches = 0
      for (const w of words) {
        if (ew.some((eww: string) => eww.includes(w) || w.includes(eww))) matches++
      }
      if (matches >= 2) return ev
    }
    return null
  }

  const procesarEnlaces = (linksOriginales: string[], titulo: string) => {
    // Retornamos una lista de opciones a renderizar
    const opciones: { nombre: string, url: string, isHD: boolean, isPremium: boolean }[] = []
    const imgDefault = 'https://i.imgur.com/NwU54jR.jpeg'
    
    // Primero, opciones normales y HD del propio canal
    linksOriginales.forEach((linkStr, idx) => {
      // Intentamos identificar a qué canal pertenece este link
      // El link es e.g. https://streamtpnew.com/global1.php?stream=espn
      const urlObj = new URL(linkStr)
      const streamParam = urlObj.searchParams.get('stream')
      
      let canalObj = CANALES.find(c => {
        if (!c.enlace.includes('stream=')) return false
        const param = new URL(c.enlace).searchParams.get('stream')
        return param === streamParam
      })

      if (canalObj) {
        // SD Version
        opciones.push({
          nombre: `${canalObj.nombre} (SD)`,
          url: `/embed?url=${encodeURIComponent(linkStr)}&t=${encodeURIComponent(titulo)}&img=${encodeURIComponent(imgDefault)}`,
          isHD: false,
          isPremium: false
        })

        // HD Version si tiene
        if (canalObj.hd) {
          const hdLink = getEnlaceHD(canalObj)
          if (hdLink) {
            opciones.push({
              nombre: `${canalObj.nombre} HD`,
              url: `/embed?url=${encodeURIComponent(hdLink)}&t=${encodeURIComponent(titulo)}&img=${encodeURIComponent(imgDefault)}`,
              isHD: true,
              isPremium: true
            })
          }
        }

        // Lógica especial Colombia para ESPN 1 y ESPN 2
        if (canalObj.nombre === 'ESPN 1') {
          const co = CANALES.find(c => c.nombre === 'ESPN 1 CO')
          if (co && co.hd) {
            opciones.push({
              nombre: 'ESPN 1 CO HD',
              url: `/embed?url=${encodeURIComponent(getEnlaceHD(co)!)}&t=${encodeURIComponent(titulo)}&img=${encodeURIComponent(imgDefault)}`,
              isHD: true,
              isPremium: true
            })
          }
        } else if (canalObj.nombre === 'ESPN 2') {
          const co = CANALES.find(c => c.nombre === 'ESPN 2 CO')
          if (co && co.hd) {
            opciones.push({
              nombre: 'ESPN 2 CO HD',
              url: `/embed?url=${encodeURIComponent(getEnlaceHD(co)!)}&t=${encodeURIComponent(titulo)}&img=${encodeURIComponent(imgDefault)}`,
              isHD: true,
              isPremium: true
            })
          }
        }

      } else {
        // Canal genérico / desconocido
        opciones.push({
          nombre: `Opción ${idx + 1}`,
          url: `/embed?url=${encodeURIComponent(linkStr)}&t=${encodeURIComponent(titulo)}&img=${encodeURIComponent(imgDefault)}`,
          isHD: false,
          isPremium: false
        })
      }
    })

    // Eliminar duplicados exactos si los hubiera
    const unicas = []
    const nombresVistos = new Set()
    for (const op of opciones) {
      if (!nombresVistos.has(op.nombre)) {
        unicas.push(op)
        nombresVistos.add(op.nombre)
      }
    }

    // Ordenar: primero Premium, luego SD
    unicas.sort((a, b) => (a.isPremium === b.isPremium ? 0 : a.isPremium ? -1 : 1))
    return unicas
  }

  return (
    <div className='relative z-10 flex flex-col min-h-screen bg-[#060d1a]'>
      <GlobalNav />
      
      <main className='max-w-[1000px] w-full mx-auto px-4 py-8 flex flex-col flex-1'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10'>
          <div>
            <h1 className='font-barlow text-3xl font-black uppercase text-white tracking-wide flex items-center gap-3'>
              Partidos en Vivo
              <span className='px-3 py-1 rounded-full border border-red-500/40 text-red-500 text-[11px] bg-red-500/10 flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.2)]'>
                <span className='w-2 h-2 rounded-full bg-red-500 animate-pulse' />
                EN DIRECTO
              </span>
            </h1>
            <p className='text-slate-400 text-sm mt-1'>
              Eventos transmitidos en este instante. Selecciona una opción para reproducir.
            </p>
          </div>
          <button 
            onClick={() => cargarDatos()}
            disabled={cargando}
            className='flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold text-slate-300 uppercase tracking-widest transition-colors'
          >
            {cargando ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        {cargando && eventosLive.length === 0 ? (
          <div className='flex justify-center items-center py-20'>
            <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
          </div>
        ) : eventosLive.length === 0 ? (
          <div className='text-center py-20 bg-white/5 rounded-2xl border border-white/10'>
            <p className='text-slate-400 text-lg'>No hay eventos en vivo en este momento.</p>
          </div>
        ) : (
          <div className='flex flex-col gap-6'>
            {eventosLive.map((evento, idx) => {
              const matchEspn = matchEventoConESPN(evento.title)
              const parseado = parsearTitulo(evento.title)
              const bandera = detectarBandera(evento.title)
              const opcionesStreaming = procesarEnlaces(evento.links, evento.title)

              // Diseño si coincide con ESPN (mostramos escudos)
              if (matchEspn) {
                const comp = matchEspn.competitions[0]
                const t1 = comp.competitors[0] // local
                const t2 = comp.competitors[1] // visita
                // ESPN pone el local en el índice 0 usualmente, pero para soccer a veces el índice 0 es home. 
                // Mejor aseguramos por homeAway
                const home = comp.competitors.find((c: any) => c.homeAway === 'home') || t1
                const away = comp.competitors.find((c: any) => c.homeAway === 'away') || t2
                const clock = matchEspn.status.displayClock
                const scoreHome = home.score
                const scoreAway = away.score

                return (
                  <div key={idx} className='bg-[#0b1326] border border-white/10 rounded-2xl overflow-hidden shadow-xl'>
                    <div className='p-5 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden'>
                      {/* Liga y Tiempo */}
                      <div className='flex flex-col items-center justify-center min-w-[100px]'>
                        <div className='text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 text-center'>{parseado.liga || 'Competición'}</div>
                        <div className='text-red-500 font-barlow font-black text-xl'>{clock}</div>
                      </div>

                      {/* Escudos y Resultado */}
                      <div className='flex-1 flex items-center justify-center gap-6 w-full'>
                        <div className='flex flex-col items-center gap-2 flex-1'>
                          <div className='w-14 h-14 relative'>
                            <Image src={home.team.logo || bandera} alt={home.team.name} fill className='object-contain' />
                          </div>
                          <span className='font-barlow text-sm font-bold text-center text-slate-200'>{home.team.name}</span>
                        </div>
                        
                        <div className='flex items-center gap-3'>
                          <span className='font-barlow text-4xl font-black text-white'>{scoreHome}</span>
                          <span className='text-slate-600 font-black'>-</span>
                          <span className='font-barlow text-4xl font-black text-white'>{scoreAway}</span>
                        </div>

                        <div className='flex flex-col items-center gap-2 flex-1'>
                          <div className='w-14 h-14 relative'>
                            <Image src={away.team.logo || bandera} alt={away.team.name} fill className='object-contain' />
                          </div>
                          <span className='font-barlow text-sm font-bold text-center text-slate-200'>{away.team.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Opciones de streaming */}
                    <div className='bg-[#060a14] border-t border-white/5 p-4'>
                      <div className='text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 pl-1'>Opciones de Transmisión</div>
                      <div className='flex flex-wrap gap-2'>
                        {opcionesStreaming.map((op, opIdx) => (
                          <Link 
                            key={opIdx} 
                            href={op.url}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-barlow text-sm font-extrabold uppercase tracking-wide transition-all ${
                              op.isPremium 
                                ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20 hover:scale-[1.02] shadow-[0_0_15px_rgba(234,179,8,0.15)]'
                                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-blue-500/50 hover:text-white'
                            }`}
                          >
                            {op.isPremium ? <Star size={14} fill='currentColor' /> : <Play size={14} />}
                            {op.nombre}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }

              // Diseño genérico si NO coincide con ESPN
              return (
                <div key={idx} className='bg-[#0b1326] border border-white/10 rounded-2xl overflow-hidden shadow-xl'>
                  <div className='p-5 flex items-center gap-4 relative overflow-hidden'>
                    <div className='w-12 h-10 flex-shrink-0 relative'>
                      <Image src={bandera} alt='Bandera' fill className='object-contain opacity-80' />
                    </div>
                    <div className='flex-1'>
                      {parseado.liga && <div className='text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1'>{parseado.liga}</div>}
                      <div className='font-barlow text-lg font-black text-slate-200 uppercase tracking-wide'>{parseado.partido}</div>
                    </div>
                  </div>

                  {/* Opciones de streaming */}
                  <div className='bg-[#060a14] border-t border-white/5 p-4'>
                    <div className='text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 pl-1'>Opciones de Transmisión</div>
                    <div className='flex flex-wrap gap-2'>
                      {opcionesStreaming.map((op, opIdx) => (
                        <Link 
                          key={opIdx} 
                          href={op.url}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-barlow text-sm font-extrabold uppercase tracking-wide transition-all ${
                            op.isPremium 
                              ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20 hover:scale-[1.02] shadow-[0_0_15px_rgba(234,179,8,0.15)]'
                              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-blue-500/50 hover:text-white'
                          }`}
                        >
                          {op.isPremium ? <Star size={14} fill='currentColor' /> : <Play size={14} />}
                          {op.nombre}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
