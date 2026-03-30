'use client'
import React, { useState, useEffect } from 'react'
import { Partido, Estado } from '@/types'
import { Pencil, Trash2, GripVertical, Save, Loader2, Search, Calendar, User, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/Toaster'
import { useRouter } from 'next/navigation'
import { motion, Reorder, AnimatePresence } from 'framer-motion'

const estadoColor: Record<Estado, string> = {
  'EN-VIVO': 'bg-red-600/10 text-red-500 border-red-600/30 animate-pulse-red',
  'PROXIMO': 'bg-blue-600/10 text-blue-400 border-blue-600/30',
  'FINALIZADO': 'bg-slate-600/10 text-slate-400 border-white/10',
}

interface Props {
  initialPartidos: Partido[]
}

export default function PartidosTable({ initialPartidos }: Props) {
  const [partidos, setPartidos] = useState(initialPartidos)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    setPartidos(initialPartidos)
  }, [initialPartidos])

  async function updatePartido(id: string, updates: Partial<Partido>) {
    setSaving(id)
    try {
      const res = await fetch(`/api/admin/partidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        toast('Actualizado', 'success')
        router.refresh()
      } else {
        toast('Error al actualizar', 'error')
      }
    } catch {
      toast('Error de red', 'error')
    } finally {
      setSaving(null)
    }
  }

  async function deletePartido(id: string) {
    if (!confirm('¿Seguro que querés eliminar este partido?')) return
    try {
      const res = await fetch(`/api/admin/partidos/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPartidos((prev) => prev.filter((p) => p.id !== id))
        toast('Partido eliminado', 'success')
      } else {
        toast('Error al eliminar', 'error')
      }
    } catch {
      toast('Error de red', 'error')
    }
  }

  async function handleReorder(newOrder: Partido[]) {
    setPartidos(newOrder)
    try {
      const res = await fetch('/api/admin/partidos/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: newOrder.map((p) => p.id) }),
      })
      if (!res.ok) toast('Error al guardar el nuevo orden', 'error')
    } catch {
      toast('Error al sincronizar orden', 'error')
    }
  }

  const filteredPartidos = partidos.filter(p => 
    p.equipo_local.toLowerCase().includes(search.toLowerCase()) || 
    p.equipo_visitante.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='flex flex-col gap-8'>
      {/* Search Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
         <div className='relative w-full max-w-lg group'>
            <div className='absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors'>
              <Search size={18} />
            </div>
            <input
              type='text'
              placeholder='Filtrar por equipo...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full bg-[#08102480] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all backdrop-blur-xl shadow-2xl'
            />
         </div>
         <div className='flex items-center gap-3 bg-blue-600/5 px-4 py-3 rounded-2xl border border-blue-600/10'>
            <Trophy size={16} className='text-amber-500' />
            <span className='text-[10px] font-black uppercase tracking-[2px] text-slate-400'>
              <span className='text-white'>{filteredPartidos.length}</span> Eventos Listados
            </span>
         </div>
      </div>

      {/* Main Container */}
      <div className='glass-panel rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]'>
        <div className='w-full overflow-x-auto min-h-[400px]'>
          <table className='w-full text-sm border-collapse'>
            <thead>
              <tr className='border-b border-white/5 text-slate-500 text-[10px] uppercase tracking-[30%] font-black'>
                <th className='px-6 py-6 w-14'></th>
                <th className='text-left px-4 py-6 font-black'>Evento Principal</th>
                <th className='text-left px-4 py-6 font-black w-40'>Estado Actual</th>
                <th className='text-center px-4 py-6 font-black w-40'>Marcador</th>
                <th className='text-left px-4 py-6 font-black w-48'>Programación</th>
                <th className='text-right px-8 py-6 font-black'>Acción</th>
              </tr>
            </thead>
            
            <Reorder.Group as='tbody' axis='y' values={partidos} onReorder={handleReorder}>
              <AnimatePresence initial={false}>
                {filteredPartidos.map((p, i) => (
                  <Reorder.Item
                    as='tr'
                    key={p.id}
                    value={p}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className='border-b border-white/[0.03] hover:bg-white/[0.04] transition-all duration-300 group'
                  >
                    {/* Drag Handle */}
                    <td className='px-6 py-6 cursor-grab active:cursor-grabbing text-slate-700 group-hover:text-blue-500 transition-colors'>
                      <div className='flex items-center justify-center p-2 rounded-lg bg-white/5 border border-transparent group-hover:border-white/10'>
                        <GripVertical size={16} />
                      </div>
                    </td>

                    {/* Match Info */}
                    <td className='px-4 py-6'>
                      <div className='flex items-center gap-4'>
                        <div className='flex flex-col'>
                          <span className='font-barlow font-black uppercase tracking-wider text-white text-lg italic leading-tight group-hover:text-blue-400 transition-colors'>
                            {p.equipo_local} <span className='text-slate-600 non-italic font-medium text-xs mx-1'>vs</span> {p.equipo_visitante}
                          </span>
                          <div className='flex items-center gap-2 mt-1.5'>
                            {p.es_destacado && (
                              <span className='flex items-center gap-1 text-[9px] font-black text-yellow-500 uppercase tracking-[2px] bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20'>
                                Featured 🔥
                              </span>
                            )}
                            <span className='text-[9px] text-slate-500 font-black uppercase tracking-[2px] bg-white/5 px-2 py-0.5 rounded border border-white/5'>
                              UID: {p.slug?.split('-').pop() || '0000'}
                            </span>
                            {p.fixture_id && (
                              <span className='text-[9px] text-blue-500/70 font-black uppercase tracking-[2px]'>Sincronizado DB</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className='px-4 py-6'>
                      <select
                        value={p.estado}
                        onChange={(e) => updatePartido(p.id, { estado: e.target.value as Estado })}
                        className={`text-[9px] font-black tracking-[2px] uppercase px-4 py-2 rounded-xl border bg-[#060d1a]/50 backdrop-blur-md focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all cursor-pointer ${estadoColor[p.estado]}`}
                      >
                        <option value='PROXIMO' className='bg-[#081024]'>PRÓXIMO</option>
                        <option value='EN-VIVO' className='bg-[#081024]'>EN VIVO</option>
                        <option value='FINALIZADO' className='bg-[#081024]'>FINALIZADO</option>
                      </select>
                    </td>

                    {/* Score Inputs */}
                    <td className='px-4 py-6'>
                      <div className='flex items-center justify-center gap-3'>
                        <div className='relative'>
                          <input
                            type='number'
                            value={p.gol_local}
                            onChange={(e) => updatePartido(p.id, { gol_local: +e.target.value })}
                            className='w-14 bg-black/40 border border-white/10 rounded-xl px-2 py-2 text-center font-black text-white focus:border-blue-500/50 outline-none transition-all text-base'
                          />
                        </div>
                        <span className='text-slate-700 font-black'>:</span>
                        <div className='relative'>
                          <input
                            type='number'
                            value={p.gol_visitante}
                            onChange={(e) => updatePartido(p.id, { gol_visitante: +e.target.value })}
                            className='w-14 bg-black/40 border border-white/10 rounded-xl px-2 py-2 text-center font-black text-white focus:border-blue-500/50 outline-none transition-all text-base'
                          />
                        </div>
                        {saving === p.id && (
                          <div className='absolute ml-36'>
                            <Loader2 size={16} className='animate-spin text-blue-500' />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Time/Date */}
                    <td className='px-4 py-6 text-slate-400'>
                      {p.hora_utc ? (
                        <div className='flex flex-col gap-1'>
                          <div className='flex items-center gap-2'>
                            <Calendar size={12} className='text-blue-500' />
                            <span className='text-white font-black uppercase text-[10px] tracking-widest'>
                              {new Date(p.hora_utc).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} ART
                            </span>
                          </div>
                          <span className='text-[9px] text-slate-500 font-bold uppercase tracking-widest ml-5'>
                            {new Date(p.hora_utc).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                      ) : (
                        <span className='text-slate-600 italic text-[10px] uppercase'>Horario pendiente</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className='px-8 py-6'>
                      <div className='flex items-center justify-end gap-3'>
                        <Link href={`/admin/partidos/${p.id}`}
                          className='flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl transition-all border border-white/10 hover:border-blue-500 shadow-lg group/btn'>
                          <Pencil size={14} />
                          <span className='text-[9px] font-black uppercase tracking-widest hidden lg:inline'>Editar</span>
                        </Link>
                        <button
                          onClick={() => deletePartido(p.id)}
                          className='p-2 bg-red-600/5 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all border border-red-600/10 hover:border-red-500 flex items-center justify-center shadow-lg group/del'>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
          </table>
        </div>
      </div>

      {filteredPartidos.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className='glass-panel rounded-3xl py-24 text-center'
        >
          <div className='w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 text-slate-700'>
            <Search size={32} />
          </div>
          <p className='text-slate-500 font-barlow italic uppercase tracking-[5px] text-xl font-black'>No se encontraron partidos</p>
          <p className='text-slate-600 text-[10px] font-black uppercase tracking-widest mt-2'>Intentá con otra búsqueda o creá uno nuevo</p>
        </motion.div>
      )}
    </div>
  )
}
)
}
