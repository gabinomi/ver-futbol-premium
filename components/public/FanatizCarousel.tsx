'use client'
import React, { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Partido } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  titulo: string
  partidos: Partido[]
}

const estadoCfg: Record<string, { label: string; dot: boolean; cls: string; thumbCls: string }> = {
  'EN-VIVO':    { label: 'EN VIVO',    dot: true,  cls: 'bg-red-600/15 border-red-600 text-red-400',       thumbCls: '' },
  'PROXIMO':    { label: 'PRÓXIMO',    dot: false, cls: 'bg-blue-600/12 border-blue-600 text-blue-400',    thumbCls: 'brightness-50 saturate-50' },
  'FINALIZADO': { label: 'FINALIZADO', dot: false, cls: 'bg-emerald-600/12 border-emerald-600 text-emerald-400', thumbCls: 'grayscale-[55%] brightness-[0.38]' },
}

export default function FanatizCarousel({ titulo, partidos }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const { scrollLeft, clientWidth } = scrollRef.current
    const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
    scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
  }

  if (partidos.length === 0) return null

  return (
    <section className='relative overflow-hidden mb-10 rounded-lg border border-white/5'>
      {/* Background image layer */}
      <div className='absolute inset-0 bg-fanatiz-argentina' />
      {/* Heavy overlay */}
      <div className='absolute inset-0 bg-gradient-to-r from-[#04192e]/70 via-[#04192e]/85 to-[#04192e]/95' />
      
      <div className='relative z-10 px-5 py-4 md:px-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-3'>
            <img src='https://fanatiz.com/fanatiz/web/playlists/lfp-icon.svg' alt='LFP' className='w-5 h-5 opacity-80' />
            <h2 className='font-barlow text-base md:text-lg font-bold tracking-[2px] text-white/90'>
              {titulo}
            </h2>
          </div>
          
          <div className='flex items-center gap-2'>
            <button 
              onClick={() => scroll('left')}
              className='p-1 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90'
            >
              <ChevronLeft size={14} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className='p-1 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90'
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Compact scrolling cards */}
        <div 
          ref={scrollRef}
          className='flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth'
        >
          {partidos.map(p => {
            const cfg = estadoCfg[p.estado] || estadoCfg['PROXIMO']
            const thumb = p.img_og || p.img_video || 'https://placehold.co/400x225/060d1a/1e40af?text=EN+VIVO'
            return (
              <Link
                key={p.id}
                href={`/partido/${p.slug}`}
                className='min-w-[200px] md:min-w-[220px] snap-start flex flex-col rounded-lg overflow-hidden border border-white/8 bg-[#08102480] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 flex-shrink-0'
              >
                {/* Compact thumbnail */}
                <div className='relative h-[110px] overflow-hidden'>
                  <Image
                    src={thumb}
                    alt={`${p.equipo_local} vs ${p.equipo_visitante}`}
                    fill
                    className={`object-cover ${cfg.thumbCls}`}
                    loading='lazy'
                  />
                  {/* Estado badge overlaid on thumbnail */}
                  <div className='absolute top-1.5 left-1.5'>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold tracking-[1px] uppercase border ${cfg.cls}`}>
                      {cfg.dot && <span className='w-1 h-1 bg-red-600 rounded-full animate-blink' />}
                      {cfg.label}
                    </span>
                  </div>
                  {p.estado === 'FINALIZADO' && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/48'>
                      <span className='font-barlow text-xs font-black text-white/65 tracking-[2px] uppercase'>Finalizado</span>
                    </div>
                  )}
                </div>
                {/* Title */}
                <div className='px-2 py-2 border-t border-white/5'>
                  <p className='font-barlow font-black text-[11px] uppercase tracking-wide text-white/80 text-center truncate'>
                    {p.equipo_local} vs {p.equipo_visitante}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
