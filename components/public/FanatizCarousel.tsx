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
    <section className='relative overflow-hidden mb-12 rounded-lg border border-white/5'>
      {/* Background image layer */}
      <div className='absolute inset-0 bg-fanatiz-argentina' />
      {/* Heavy overlay - image barely visible, like reference */}
      <div className='absolute inset-0 bg-gradient-to-r from-[#04192e]/70 via-[#04192e]/85 to-[#04192e]/95' />
      
      <div className='relative z-10 p-5 md:p-8'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <img src='https://fanatiz.com/fanatiz/web/playlists/lfp-icon.svg' alt='LFP' className='w-6 h-6 opacity-80' />
            <h2 className='font-barlow text-lg md:text-xl font-bold tracking-[2px] text-white/90'>
              {titulo}
            </h2>
          </div>
          
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <button 
                onClick={() => scroll('left')}
                className='p-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90'
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => scroll('right')}
                className='p-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90'
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className='flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-2'
        >
          {partidos.map(p => (
            <div key={p.id} className='min-w-[260px] md:min-w-[300px] lg:min-w-[330px] snap-start'>
              <PostCard partido={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
