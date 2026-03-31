'use client'
import React, { useRef } from 'react'
import { Partido } from '@/types'
import PostCard from './PostCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  titulo: string
  partidos: Partido[]
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
    <section className='bg-fanatiz-argentina rounded-[2rem] overflow-hidden mb-12 shadow-2xl border border-white/5'>
      <div className='bg-gradient-to-r from-[#04192e] via-transparent to-transparent p-8 md:p-12'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='font-barlow text-3xl font-black uppercase tracking-[4px] text-white italic drop-shadow-md'>
            {titulo}
          </h2>
          <div className='flex items-center gap-4'>
            <button 
              onClick={() => scroll('left')}
              className='p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-90 shadow-lg'
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className='p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-90 shadow-lg'
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className='flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-4'
        >
          {partidos.map(p => (
            <div key={p.id} className='min-w-[280px] md:min-w-[320px] lg:min-w-[350px] snap-start'>
              <PostCard partido={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
