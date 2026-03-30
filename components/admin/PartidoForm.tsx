'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Partido, Estado } from '@/types'
import { Search, Save, Loader2, Calendar, Target, Image as ImageIcon, CheckCircle2, AlertCircle, Info, Radio, TV } from 'lucide-react'
import { useToast } from '@/components/ui/Toaster'
import { AnimatePresence, motion } from 'framer-motion'
import { getTimezoneEstimates } from '@/lib/utils'

interface Props {
  partido?: Partial<Partido>
  modo: 'nuevo' | 'editar'
}

interface FixtureResult {
  fixture_id: number
  hora_utc: string
  local: string
  visitante: string
  escudo_local: string | null
  escudo_visitante: string | null
}

const estadoOpts: Estado[] = ['PROXIMO', 'EN-VIVO', 'FINALIZADO']
const sugerenciasCanales = ['ESPN', 'Disney +', 'TyC Sports', 'Fox Sports', 'Star+']

export default function PartidoForm({ partido, modo }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const [fixturesFound, setFixturesFound] = useState<FixtureResult[]>([])
  
  // Estados para el calculador de horarios
  const [horaArg, setHoraArg] = useState('')
  const [estimates, setEstimates] = useState<{ grupo: string; countries: string; offset: number; time: string }[]>([])

  const [form, setForm] = useState<Partial<Partido>>({
    equipo_local: '',
    equipo_visitante: '',
    gol_local: 0,
    gol_visitante: 0,
    estado: 'PROXIMO',
    hora_utc: '',
    canales: [], // Ahora es un array
    link_video: '',
    link1: '',
    link2: '',
    link3: '',
    img_video: '',
    img_og: '',
    escudo_local: '',
    escudo_visitante: '',
    es_destacado: false,
    metadata: {},
    ...partido,
  })

  function set(key: keyof Partido, val: any) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function addCanal(canal: string) {
    const actual = form.canales || []
    if (actual.includes(canal)) return
    set('canales', [...actual, canal])
  }

  function removeCanal(canal: string) {
    const actual = form.canales || []
    set('canales', actual.filter(c => c !== canal))
  }

  function handleHoraArgChange(val: string) {
    setHoraArg(val)
    if (val.length === 5) {
      setEstimates(getTimezoneEstimates(val))
    } else {
      setEstimates([])
    }
  }

  function aplicarHoraUtc() {
    if (!horaArg || !horaArg.includes(':')) return
    const [h, m] = horaArg.split(':').map(Number)
    const now = new Date()
    const utcDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), h + 3, m, 0))
    set('hora_utc', utcDate.toISOString())
    toast('Hora UTC actualizada (basada en ART)', 'success')
  }

  async function buscarPartido() {
    if (!form.equipo_local || !form.equipo_visitante) {
      toast('Ingresá los nombres de los equipos primero', 'error')
      return
    }
    setBuscando(true)
    setFixturesFound([])
    try {
      const res = await fetch('/api/admin/buscar-fixture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ local: form.equipo_local, visitante: form.equipo_visitante }),
      })
      const data = await res.json() as FixtureResult[]
      
      if (data.length > 0) {
        setFixturesFound(data)
        if (data.length === 1) {
          seleccionarFixture(data[0])
          toast('✓ Partido encontrado y cargado', 'success')
        } else {
          toast(`Se encontraron ${data.length} posibles partidos. Seleccioná el correcto.`, 'success')
        }
      } else {
        toast('No se encontró el partido. Ingresá los datos manualmente.', 'error')
      }
    } catch {
      toast('Error al buscar en la API', 'error')
    } finally {
      setBuscando(false)
    }
  }

  function seleccionarFixture(f: FixtureResult) {
    setForm(prev => ({
      ...prev,
      equipo_local: f.local,
      equipo_visitante: f.visitante,
      hora_utc: f.hora_utc,
      escudo_local: f.escudo_local || prev.escudo_local,
      escudo_visitante: f.escudo_visitante || prev.escudo_visitante,
      fixture_id: f.fixture_id,
    }))
    setFixturesFound([])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const url = modo === 'nuevo' ? '/api/admin/partidos' : `/api/admin/partidos/${partido?.id}`
    const method = modo === 'nuevo' ? 'POST' : 'PUT'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        toast(modo === 'nuevo' ? 'Partido creado con éxito' : 'Cambios guardados', 'success')
        router.push('/admin/partidos')
        router.refresh()
      } else {
        toast(data.error || 'Error al guardar', 'error')
        setLoading(false)
      }
    } catch {
      toast('Error de red al guardar', 'error')
      setLoading(false)
    }
  }

  const inputCls = 'w-full bg-[#081024]/60 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm backdrop-blur-md'
  const labelCls = 'text-[10px] font-black uppercase tracking-[2.5px] text-slate-500 mb-2 flex items-center gap-2'

  const PreviewImg = ({ url, label, type }: { url?: string | null, label: string, type: 'shield' | 'banner' }) => (
    <div className={`flex items-center gap-3 mt-3 p-3 bg-white/[0.03] rounded-2xl border border-white/5 group shadow-inner`}>
      <div className={`${type === 'shield' ? 'w-12 h-12' : 'w-24 h-12'} bg-black/40 rounded-xl flex items-center justify-center border border-white/5 overflow-hidden transition-transform group-hover:scale-105 duration-500`}>
        {url ? (
          <img src={url} alt={label} className='w-full h-full object-contain' onError={(e) => (e.currentTarget.style.opacity = '0')} />
        ) : (
          <ImageIcon size={20} className='text-slate-800' />
        )}
      </div>
      <div className='flex flex-col'>
        <span className='text-[9px] text-slate-500 font-black uppercase tracking-widest'>{label}</span>
        <span className='text-[8px] text-blue-500/60 font-black uppercase tracking-widest mt-0.5'>{url ? '✓ Detectada' : 'Pendiente'}</span>
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className='max-w-4xl mx-auto'>
      {/* Dynamic Floating Header */}
      <div className='flex items-center justify-between mb-10 sticky top-[72px] bg-[#060d1a]/60 backdrop-blur-xl py-6 z-20 border-b border-white/5 -mx-4 px-4 group'>
        <div className='flex flex-col'>
          <h1 className='font-barlow text-4xl font-black uppercase tracking-widest text-white italic leading-none flex items-center gap-3'>
            <span className='w-2 h-8 bg-blue-600 rounded-full group-hover:scale-y-125 transition-transform origin-bottom' />
            {modo === 'nuevo' ? 'Nuevo Evento' : 'Edición Pro'}
          </h1>
          <span className='text-[10px] font-bold text-slate-500 uppercase tracking-[4px] mt-2 ml-5 opacity-70'>
            {modo === 'nuevo' ? 'Configuración inicial del stream' : `Editando ID: ${form.id || 'N/A'}`}
          </span>
        </div>
        <button type='submit' disabled={loading}
          className='flex items-center gap-3 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-barlow font-black uppercase tracking-widest text-sm transition-all shadow-[0_10px_30px_rgba(37,99,235,0.2)] active:scale-95 disabled:opacity-50 border border-white/10'>
          {loading ? <Loader2 size={20} className='animate-spin' /> : <Save size={20} />}
          <span>Sincronizar</span>
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-10'>
        
        {/* Columna Principal: 7/12 */}
        <div className='lg:col-span-7 flex flex-col gap-8'>
          <section className='glass-panel rounded-[2.5rem] p-10 relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] rounded-full' />
            <div className='flex items-center justify-between mb-8'>
              <h2 className='text-slate-400 text-[10px] font-black uppercase tracking-[4px] flex items-center gap-3'>
                <Target size={14} className='text-blue-500' /> Información del Duelo
              </h2>
              <div className='flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all cursor-pointer group/dest'
                onClick={() => set('es_destacado', !form.es_destacado)}>
                <span className={`text-[9px] font-black uppercase tracking-widest ${form.es_destacado ? 'text-yellow-500' : 'text-slate-600'}`}>Partidazo 🔥</span>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${form.es_destacado ? 'bg-yellow-500/40' : 'bg-slate-800'}`}>
                  <div className={`absolute top-1 w-2 h-2 rounded-full transition-all ${form.es_destacado ? 'right-1 bg-yellow-400' : 'left-1 bg-slate-600'}`} />
                </div>
              </div>
            </div>
            
            <div className='flex flex-col gap-8'>
              <div className='grid grid-cols-2 gap-6'>
                <div className='group'>
                  <label className={labelCls}>Equipo Local</label>
                  <input className={inputCls} value={form.equipo_local} onChange={e => set('equipo_local', e.target.value)} placeholder='Ej: Real Madrid' required />
                  <PreviewImg url={form.escudo_local} label='Shield Data Source' type='shield' />
                </div>
                <div className='group'>
                  <label className={labelCls}>Visitante</label>
                  <input className={inputCls} value={form.equipo_visitante} onChange={e => set('equipo_visitante', e.target.value)} placeholder='Ej: FC Barcelona' required />
                  <PreviewImg url={form.escudo_visitante} label='Shield Data Source' type='shield' />
                </div>
              </div>

              <div>
                <button type='button' onClick={buscarPartido} disabled={buscando}
                  className='relative w-full group overflow-hidden bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-blue-500/30 py-5 rounded-[1.5rem] transition-all duration-300'>
                  <div className='relative z-10 flex items-center justify-center gap-3'>
                    {buscando ? <Loader2 size={18} className='animate-spin text-blue-500' /> : <Search size={18} className='text-blue-500 group-hover:scale-110 transition-transform' />}
                    <span className='font-barlow font-black uppercase tracking-[3px] text-xs text-white'>Buscar Fixture en Tiempo Real</span>
                  </div>
                  <div className='absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity' />
                </button>

                <AnimatePresence>
                  {fixturesFound.length > 1 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className='mt-6 glass-panel rounded-3xl p-6 border-blue-500/20'
                    >
                      <div className='flex items-center gap-2 mb-4'>
                        <Info size={14} className='text-blue-500' />
                        <span className='text-[10px] font-black uppercase tracking-[2px] text-blue-400'>Múltiples coincidencias (API)</span>
                      </div>
                      <div className='flex flex-col gap-3'>
                        {fixturesFound.map((f) => (
                          <button
                            key={f.fixture_id}
                            type='button'
                            onClick={() => seleccionarFixture(f)}
                            className='flex items-center justify-between p-4 bg-white/5 hover:bg-blue-600/10 rounded-2xl transition-all border border-white/5 hover:border-blue-500/20 group text-left'
                          >
                            <div className='flex flex-col'>
                              <span className='text-sm font-barlow font-black text-white uppercase tracking-wider group-hover:text-blue-400'>
                                {f.local} <span className='text-slate-600 italic'>vs</span> {f.visitante}
                              </span>
                              <span className='text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1'>
                                {new Date(f.hora_utc).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className='flex items-center gap-2'>
                              <img src={f.escudo_local || ''} className='w-8 h-8 object-contain' />
                              <img src={f.escudo_visitante || ''} className='w-8 h-8 object-contain' />
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='group'>
                  <label className={labelCls}>Estado Global</label>
                  <div className='relative'>
                    <select className={`${inputCls} appearance-none italic font-black`} value={form.estado} onChange={e => set('estado', e.target.value as Estado)}>
                      {estadoOpts.map(o => <option key={o} value={o} className='bg-[#081024]'>{o}</option>)}
                    </select>
                    <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500'>
                       <Radio size={14} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Goles Local</label>
                  <input type='number' min={0} className={`${inputCls} text-center font-black text-lg`} value={form.gol_local} onChange={e => set('gol_local', +e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Goles Visitante</label>
                  <input type='number' min={0} className={`${inputCls} text-center font-black text-lg`} value={form.gol_visitante} onChange={e => set('gol_visitante', +e.target.value)} />
                </div>
              </div>
            </div>
          </section>

          <section className='glass-panel rounded-[2.5rem] p-10'>
            <h2 className='text-slate-400 text-[10px] font-black uppercase tracking-[4px] mb-8 flex items-center gap-3'>
              <TV size={14} className='text-emerald-500' /> Transmisión & Redes
            </h2>
            <div className='flex flex-col gap-8'>
              <div>
                <label className={labelCls}>Canales (Tags)</label>
                <div className='flex flex-wrap gap-2 mb-4'>
                  {sugerenciasCanales.map(s => (
                    <button 
                      key={s} 
                      type='button' 
                      onClick={() => addCanal(s)}
                      className='text-[9px] font-bold uppercase tracking-widest px-4 py-2 bg-white/5 border border-white/5 rounded-[1rem] text-slate-500 hover:text-white hover:bg-blue-600/20 hover:border-blue-500 transition-all active:scale-95'
                    >
                      + {s}
                    </button>
                  ))}
                </div>
                
                <div className='bg-[#081024]/40 border border-white/5 rounded-2xl p-4 min-h-[60px] flex flex-wrap gap-2'>
                  {form.canales && form.canales.length > 0 ? (
                    form.canales.map(c => (
                      <div key={c} className='flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 px-3 py-1.5 rounded-xl group/tag'>
                        <span className='text-[10px] font-black text-blue-400 uppercase tracking-wider'>{c}</span>
                        <button type='button' onClick={() => removeCanal(c)} className='text-blue-500/40 hover:text-red-500 transition-colors'>
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className='text-[10px] text-slate-700 font-bold uppercase tracking-[2px] m-auto'>No hay canales seleccionados</span>
                  )}
                </div>
                
                <div className='mt-4 flex gap-2'>
                  <input 
                    id='custom-canal'
                    className={`${inputCls} !py-2 !px-4 !text-xs`} 
                    placeholder='Agregar canal personalizado...' 
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const val = (e.currentTarget as HTMLInputElement).value.trim()
                        if (val) {
                          addCanal(val)
                          ;(e.currentTarget as HTMLInputElement).value = ''
                        }
                      }
                    }}
                  />
                  <button 
                    type='button'
                    onClick={() => {
                      const input = document.getElementById('custom-canal') as HTMLInputElement
                      const val = input.value.trim()
                      if (val) {
                        addCanal(val)
                        input.value = ''
                      }
                    }}
                    className='bg-white/5 hover:bg-blue-600/20 px-4 rounded-xl border border-white/5 hover:border-blue-500/30 text-blue-500 transition-all active:scale-95'
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <div className='space-y-6'>
                <div>
                  <label className={labelCls}>Banner del Encuentro (600x400)</label>
                  <input className={inputCls} value={form.img_video || ''} onChange={e => set('img_video', e.target.value)} placeholder='https://imgur.com/...' />
                  <PreviewImg url={form.img_video} label='Visual Assets (HighRes)' type='banner' />
                </div>
                <div className='border-t border-white/5 pt-6'>
                  <label className={labelCls}>URL OpenGraph (Social Web)</label>
                  <input className={inputCls} value={form.img_og || ''} onChange={e => set('img_og', e.target.value)} placeholder='https://imgur.com/...' />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Columna Lateral: 5/12 */}
        <div className='lg:col-span-5 flex flex-col gap-8'>
          <section className='glass-panel rounded-[2.5rem] p-8 border-emerald-500/10'>
            <div className='flex items-center justify-between mb-8'>
               <h2 className='text-slate-400 text-[10px] font-black uppercase tracking-[4px] flex items-center gap-3'>
                 <Calendar size={14} className='text-emerald-500' /> Programación
               </h2>
               <div className='px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20'>
                  <span className='text-[8px] font-black text-emerald-400 uppercase tracking-widest'>TimeSync Active</span>
               </div>
            </div>

            <div className='flex flex-col gap-6'>
              <div className='bg-black/40 p-6 rounded-2xl border border-white/5'>
                <label className={`${labelCls} !text-emerald-400/80`}>Entrada Horario (ART - Argentina)</label>
                <div className='flex gap-3'>
                  <input 
                    type='text' 
                    placeholder='HH:mm' 
                    className={`${inputCls} !bg-black/20 text-center font-black text-xl tracking-widest`}
                    value={horaArg} 
                    onChange={e => handleHoraArgChange(e.target.value)} 
                  />
                  <button type='button' onClick={aplicarHoraUtc} 
                    className='bg-emerald-600 hover:bg-emerald-500 text-white px-6 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 border border-white/10'>
                    Fijar
                  </button>
                </div>
                <p className='text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-4 text-center italic'>
                  * Se calcularán automáticamente los husos horarios regionales
                </p>
              </div>

              <div className='grid grid-cols-1 gap-1.5 p-2'>
                {estimates.length > 0 ? estimates.map(e => (
                  <div key={e.grupo} className='flex justify-between items-center py-2 px-4 bg-white/[0.02] rounded-xl border border-transparent hover:border-white/5 transition-colors'>
                    <div className='flex flex-col'>
                       <span className='text-[9px] text-slate-500 font-black uppercase tracking-widest'>{e.countries}</span>
                       <span className='text-[8px] text-slate-700 font-bold uppercase'>{e.grupo}</span>
                    </div>
                    <span className='text-sm font-barlow font-black text-white italic tracking-wider'>{e.time}</span>
                  </div>
                )) : (
                  <div className='py-8 text-center bg-white/[0.02] rounded-2xl border border-dashed border-white/5'>
                     <span className='text-[10px] text-slate-700 font-black uppercase tracking-[3px] italic'>Esperando horario ART...</span>
                  </div>
                )}
              </div>

              <div className='pt-4 border-t border-white/5'>
                <label className={labelCls}>Timestamp ISO (UTC Final)</label>
                <input className={`${inputCls} !text-[10px] !py-3 tracking-tighter text-slate-400`} value={form.hora_utc || ''} onChange={e => set('hora_utc', e.target.value)} placeholder='Generado automáticamente...' />
              </div>
            </div>
          </section>

          <section className='glass-panel rounded-[2.5rem] p-8 border-blue-500/10'>
            <h2 className='text-slate-400 text-[10px] font-black uppercase tracking-[4px] mb-8 flex items-center gap-3'>
              <Radio size={14} className='text-blue-500' /> Nodos de Streaming
            </h2>
            <div className='flex flex-col gap-5'>
              <div>
                <label className={labelCls}>Portal de Redirección (Directo)</label>
                <input className={`${inputCls} !text-blue-400 font-medium`} value={form.link_video || ''} onChange={e => set('link_video', e.target.value)} placeholder='https://verfutbol-gratis.blogspot.com/...' />
              </div>
              <div className='pt-4 space-y-4'>
                <p className='text-[9px] font-black text-slate-600 uppercase tracking-[3px] text-center mb-6'>Puertos de Respaldo</p>
                {(['link1','link2','link3'] as const).map((k, i) => (
                  <div key={k} className='relative group'>
                    <div className='absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-slate-800 rounded-full group-focus-within:bg-blue-600 transition-colors' />
                    <input className={`${inputCls} !py-3`} value={(form[k] as string) || ''} onChange={e => set(k, e.target.value)} placeholder={`Opción de respaldo #0${i+1}`} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className='bg-gradient-to-br from-blue-600/5 to-emerald-600/5 border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center text-center'>
            <div className='w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-5 rotate-3 hover:rotate-0 transition-transform'>
              <CheckCircle2 size={24} className='text-blue-500' />
            </div>
            <h4 className='text-xs font-black uppercase tracking-[3px] text-white italic mb-3'>Validación de Despliegue</h4>
            <p className='text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-loose max-w-[200px]'>
              Los cambios se reflejarán en el FRONTEND inmediatamente tras pulsar "Sincronizar".
            </p>
          </div>
        </div>

      </div>
    </form>
  )
}
