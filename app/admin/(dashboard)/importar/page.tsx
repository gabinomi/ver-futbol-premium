'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { utcToArg, parsearTitulo } from '@/lib/flags'
import { fetchEspnDailyScoreboard, matchEspnEvent, ESPNEventInfo } from '@/lib/espn'
import { Play, RefreshCw, CheckCircle2, Clock, Filter, Loader2, CalendarCheck, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'

interface Evento {
  title: string
  time: string
  category: string
  status: string
  link: string
  language: string
}

interface GrupoEvento {
  title: string
  time: string
  status: string
  category: string
  links: string[]
  parsed: { liga: string | null; partido: string }
}

const CATEGORIAS_FUTBOL = ['Fútbol', 'Fútbol_cup', 'Futbol']

export default function ImportarAgendaPage() {
  const router = useRouter()
  const [eventos, setEventos] = useState<GrupoEvento[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<'futbol' | 'todos'>('futbol')
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set())
  const [importando, setImportando] = useState(false)
  const [importados, setImportados] = useState<string[]>([])
  const [errores, setErrores] = useState<string[]>([])
  const [expandedLinks, setExpandedLinks] = useState<Set<string>>(new Set())

  const fetchEventos = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/eventos', { cache: 'no-store' })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      // Agrupar eventos por título+hora (mismo partido, múltiples links)
      const gruposMap: Record<string, GrupoEvento> = {}
      ;(data as Evento[]).forEach(e => {
        const key = `${e.title}|${e.time}`
        if (!gruposMap[key]) {
          const parsed = parsearTitulo(e.title)
          gruposMap[key] = {
            title: e.title,
            time: e.time,
            status: e.status,
            category: e.category,
            links: [],
            parsed,
          }
        }
        gruposMap[key].links.push(e.link)
      })

      const lista = Object.values(gruposMap).sort((a, b) => a.time.localeCompare(b.time))
      setEventos(lista)
    } catch (err: any) {
      setError(err.message || 'Error al cargar la agenda')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchEventos()
  }, [])

  const eventosFiltrados = filtro === 'futbol'
    ? eventos.filter(e => 
        CATEGORIAS_FUTBOL.includes(e.category) || 
        ['en vivo', 'pronto', 'proximo', 'próximo'].includes(e.status.toLowerCase())
      )
    : eventos

  const toggleSeleccion = (key: string) => {
    setSeleccionados(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const toggleLinks = (key: string) => {
    setExpandedLinks(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const seleccionarTodos = () => {
    if (seleccionados.size === eventosFiltrados.length) {
      setSeleccionados(new Set())
    } else {
      setSeleccionados(new Set(eventosFiltrados.map(e => `${e.title}|${e.time}`)))
    }
  }

  // Extraer equipos local y visitante del título del evento
  const parsearEquipos = (parsed: { liga: string | null; partido: string }) => {
    const vs = parsed.partido.match(/^(.+?)\s+(?:vs\.?|VS\.?)\s+(.+)$/i)
    if (vs) {
      return {
        local: vs[1].trim(),
        visitante: vs[2].trim(),
      }
    }
    // Fallback: split por " - "
    const guion = parsed.partido.split(' - ')
    if (guion.length === 2) return { local: guion[0].trim(), visitante: guion[1].trim() }
    return { local: parsed.partido, visitante: '' }
  }

  const importarSeleccionados = async () => {
    const grupos = eventosFiltrados.filter(e => seleccionados.has(`${e.title}|${e.time}`))
    if (grupos.length === 0) return

    setImportando(true)
    setImportados([])
    setErrores([])

    const resultOk: string[] = []
    const resultErr: string[] = []

    let espnEvents: ESPNEventInfo[] = []
    try {
      espnEvents = await fetchEspnDailyScoreboard()
    } catch (e) {
      console.warn("No se pudo cargar el scoreboard de ESPN", e)
    }

    for (const grupo of grupos) {
      try {
        const equipos = parsearEquipos(grupo.parsed)
        
        let espnId: string | null = null
        if (espnEvents.length > 0) {
          espnId = matchEspnEvent(equipos.local, equipos.visitante, espnEvents)
        }

        // StreamTP usa UTC-5 (Panamá). Para guardar en Supabase (UTC real) sumar +5h.
        // Así: 19:30 StreamTP → 00:30 UTC → 21:30 ARG (UTC-3) ✓
        const buildHoraUtc = (timeStr: string): string => {
          const parts = timeStr.split(':')
          if (parts.length < 2) return new Date().toISOString()
          const h = parseInt(parts[0], 10)
          const m = parseInt(parts[1], 10)
          if (isNaN(h) || isNaN(m)) return new Date().toISOString()
          // UTC = StreamTP_time + 5h (porque StreamTP es UTC-5)
          const now = new Date()
          return new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            h + 5,   // +5 → UTC-5 a UTC real
            m,
            0
          )).toISOString()
        }

        const hora_utc = buildHoraUtc(grupo.time)
        
        // Construir slug automático
        const slug = `${equipos.local}-vs-${equipos.visitante}-${Date.now()}`
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')

        const payload = {
          equipo_local: equipos.local,
          equipo_visitante: equipos.visitante,
          slug,
          hora_utc: hora_utc,          // ISO completo: "2026-04-14T19:30:00.000Z"
          estado: grupo.status === 'en vivo' ? 'EN-VIVO' : 'PROXIMO',
          link1: grupo.links[0] || null,
          link2: grupo.links[1] || null,
          link3: grupo.links[2] || null,
          link_video: null,
          canales: [],
          gol_local: 0,
          gol_visitante: 0,
          es_destacado: false,
          categoria: CATEGORIAS_FUTBOL.includes(grupo.category) ? 'Fútbol Internacional' : null,
          img_video: null,
          img_og: null,
          metadata: {
            importado_de: 'agenda',
            titulo_original: grupo.title,
            liga: grupo.parsed.liga || null,
            espn_id: espnId || null
          },
        }

        const res = await fetch('/api/admin/partidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || `HTTP ${res.status}`)
        }

        const data = await res.json()
        resultOk.push(data.id || grupo.title)
      } catch (err: any) {
        resultErr.push(`${grupo.parsed.partido}: ${err.message}`)
      }
    }

    setImportados(resultOk)
    setErrores(resultErr)
    setImportando(false)
    setSeleccionados(new Set())

    if (resultOk.length > 0) {
      setTimeout(() => router.push('/admin/partidos'), 2000)
    }
  }

  const esVivo = (status: string) => status === 'en vivo'

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='font-barlow text-3xl font-black uppercase tracking-widest text-white italic flex items-center gap-3'>
            <CalendarCheck size={28} className='text-emerald-500' />
            Importar desde Agenda
          </h1>
          <p className='text-[10px] font-bold text-slate-500 uppercase tracking-[3px] mt-1 ml-10'>
            Seleccioná los eventos y crealos como partidos editables
          </p>
        </div>
        <button
          onClick={() => fetchEventos(true)}
          disabled={refreshing || loading}
          className='flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs font-black uppercase tracking-widest disabled:opacity-50'
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {/* Resultados de importación */}
      {(importados.length > 0 || errores.length > 0) && (
        <div className='mb-6 flex flex-col gap-3'>
          {importados.length > 0 && (
            <div className='flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3'>
              <CheckCircle2 size={16} className='text-emerald-400 flex-shrink-0' />
              <span className='text-emerald-400 text-sm font-bold'>
                {importados.length} partido{importados.length > 1 ? 's' : ''} creado{importados.length > 1 ? 's' : ''}. Redirigiendo al listado...
              </span>
            </div>
          )}
          {errores.length > 0 && (
            <div className='bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3'>
              <div className='flex items-center gap-2 mb-2'>
                <AlertCircle size={16} className='text-red-400' />
                <span className='text-red-400 text-sm font-bold'>{errores.length} error{errores.length > 1 ? 'es' : ''}</span>
              </div>
              {errores.map((e, i) => (
                <p key={i} className='text-red-300 text-xs ml-6'>{e}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-3 mb-5 bg-[#081024cc] border border-white/5 rounded-2xl px-5 py-4 backdrop-blur-md'>
        {/* Filtro */}
        <div className='flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/5'>
          <button
            onClick={() => setFiltro('futbol')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${filtro === 'futbol' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            Solo Fútbol
          </button>
          <button
            onClick={() => setFiltro('todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${filtro === 'todos' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            Todos
          </button>
        </div>

        <div className='flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500'>
          <Filter size={12} />
          {eventosFiltrados.length} eventos
        </div>

        <button
          onClick={seleccionarTodos}
          className='text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors ml-auto'
        >
          {seleccionados.size === eventosFiltrados.length && eventosFiltrados.length > 0 ? 'Deseleccionar todo' : 'Seleccionar todo'}
        </button>

        {/* Botón importar */}
        <button
          onClick={importarSeleccionados}
          disabled={seleccionados.size === 0 || importando}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
            seleccionados.size > 0 && !importando
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/30 shadow-lg shadow-emerald-900/20'
              : 'bg-white/5 text-slate-600 border-white/5 cursor-not-allowed'
          }`}
        >
          {importando
            ? <><Loader2 size={14} className='animate-spin' /> Importando...</>
            : <><Play size={14} className='fill-current' /> Importar {seleccionados.size > 0 ? `(${seleccionados.size})` : ''}</>
          }
        </button>
      </div>

      {/* Lista de eventos */}
      {loading ? (
        <div className='flex flex-col items-center justify-center py-24 gap-4'>
          <Loader2 size={32} className='text-blue-500 animate-spin' />
          <span className='text-[11px] font-black uppercase tracking-widest text-slate-500'>Cargando agenda en vivo...</span>
        </div>
      ) : error ? (
        <div className='flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4'>
          <AlertCircle size={18} className='text-red-400' />
          <span className='text-red-400 text-sm font-bold'>{error}</span>
        </div>
      ) : eventosFiltrados.length === 0 ? (
        <div className='text-center py-20 text-slate-600 font-barlow text-lg font-black uppercase tracking-widest'>
          No hay eventos disponibles
        </div>
      ) : (
        <div className='flex flex-col gap-2'>
          {eventosFiltrados.map(grupo => {
            const key = `${grupo.title}|${grupo.time}`
            const isSelected = seleccionados.has(key)
            const isLinksOpen = expandedLinks.has(key)
            const horaArg = utcToArg(grupo.time)
            const equipos = parsearEquipos(grupo.parsed)
            const vivo = esVivo(grupo.status)

            return (
              <div
                key={key}
                onClick={() => toggleSeleccion(key)}
                className={`relative rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                  isSelected
                    ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.1)]'
                    : vivo
                      ? 'bg-red-600/5 border-red-600/30 hover:border-red-500/50'
                      : 'bg-[#081024cc] border-white/5 hover:border-blue-500/30 hover:bg-blue-600/5'
                }`}
              >
                <div className='flex items-center gap-3 px-4 py-3'>
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected ? 'bg-blue-600 border-blue-500' : 'border-slate-700 bg-transparent'
                  }`}>
                    {isSelected && <CheckCircle2 size={12} className='text-white' />}
                  </div>

                  {/* Hora */}
                  <div className='w-12 flex-shrink-0 text-center'>
                    <span className='font-barlow text-base font-black text-slate-200 leading-none'>{horaArg}</span>
                    <span className='block text-[8px] font-semibold text-slate-600 uppercase tracking-widest'>ARG</span>
                  </div>

                  {/* Estado badge */}
                  {vivo ? (
                    <div className='flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/15 border border-red-600/40 flex-shrink-0'>
                      <span className='w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse' />
                      <span className='text-[9px] font-black text-red-500 uppercase tracking-widest'>Vivo</span>
                    </div>
                  ) : (
                    <div className='flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600/10 border border-blue-600/30 flex-shrink-0'>
                      <Clock size={9} className='text-blue-400' />
                      <span className='text-[9px] font-black text-blue-400 uppercase tracking-widest'>Próximo</span>
                    </div>
                  )}

                  {/* Nombres de equipos */}
                  <div className='flex-1 min-w-0'>
                    {grupo.parsed.liga && (
                      <div className='text-[9px] font-bold uppercase tracking-widest text-slate-600 truncate'>{grupo.parsed.liga}</div>
                    )}
                    <div className='font-barlow text-sm font-extrabold uppercase tracking-wide text-slate-200 truncate'>
                      {equipos.local}
                      <span className='text-slate-600 mx-1.5 font-bold'>vs</span>
                      {equipos.visitante}
                    </div>
                  </div>

                  {/* Links count + expand */}
                  <div
                    className='flex items-center gap-1.5 text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0 z-10'
                    onClick={e => { e.stopPropagation(); toggleLinks(key) }}
                  >
                    <span className='text-[9px] font-black uppercase tracking-widest'>{grupo.links.length} link{grupo.links.length > 1 ? 's' : ''}</span>
                    {isLinksOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </div>

                {/* Links expandibles */}
                {isLinksOpen && (
                  <div
                    className='px-4 pb-3 border-t border-white/5 pt-2'
                    onClick={e => e.stopPropagation()}
                  >
                    <p className='text-[9px] font-black uppercase tracking-[2px] text-slate-600 mb-2'>Links de stream disponibles</p>
                    <div className='flex flex-col gap-1'>
                      {grupo.links.map((link, i) => {
                        const streamId = new URL(link).searchParams.get('stream') || `opción-${i+1}`
                        return (
                          <div key={i} className='flex items-center gap-2 text-[10px] text-slate-500 font-mono'>
                            <span className='text-blue-500 font-black text-[9px] uppercase'>{i+1}.</span>
                            <span className='truncate'>{streamId}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Footer info */}
      <div className='mt-8 p-5 bg-white/[0.02] border border-white/5 rounded-2xl'>
        <p className='text-[10px] font-bold uppercase tracking-widest text-slate-600 leading-relaxed'>
          <span className='text-blue-400'>ℹ</span>&nbsp; Los partidos importados se crean en estado <span className='text-white'>PRÓXIMO</span> o <span className='text-red-400'>EN VIVO</span> según la agenda. 
          Podés editarlos después para agregar canales, imagen del banner, OpenGraph y más. 
          Los links de stream se asignan automáticamente (hasta 3 opciones).
        </p>
      </div>
    </div>
  )
}
