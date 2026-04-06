import { supabase } from '@/lib/supabase'
import { Partido } from '@/types'
import PostCard from '@/components/public/PostCard'
import FanatizCarousel from '@/components/public/FanatizCarousel'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ver Fútbol EN VIVO Gratis | Partidos de Hoy',
  description: 'Ver fútbol EN VIVO gratis. Partidos de hoy con links de streaming, horarios por país y marcadores en tiempo real.',
}

export const revalidate = 60

async function getPartidos(): Promise<Partido[]> {
  const { data } = await supabase
    .from('partidos')
    .select('*')
    .order('creado_en', { ascending: false })
    .limit(30)
  return (data as Partido[]) || []
}

export default async function HomePage() {
  const partidos = await getPartidos()
  const argentina = partidos.filter(p => p.categoria === 'Fútbol Argentino').slice(0, 7)
  const otros = partidos.filter(p => p.categoria !== 'Fútbol Argentino').slice(0, 4)

  return (
    <main className='relative z-10 max-w-[1400px] mx-auto px-4 py-8'>
      {/* Banner top */}
      <div className='flex justify-center mb-6'>
        <div className='w-full max-w-[728px] h-[90px] bg-white/5 rounded-lg flex items-center justify-center text-white/20 text-xs tracking-widest uppercase border border-white/5'>
          Banner Publicitario 728×90
        </div>
      </div>

      {/* Navegación rápida (Automatizados) */}
      <div className='flex flex-wrap justify-center gap-4 mb-10'>
        <Link href='/calendario' className='px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-600 hover:to-blue-500 rounded-xl font-barlow font-bold text-lg tracking-wider uppercase text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:scale-105'>
          📅 Agenda Deportiva
        </Link>
        <Link href='/canales' className='px-6 py-3 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:to-emerald-500 rounded-xl font-barlow font-bold text-lg tracking-wider uppercase text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all hover:scale-105'>
          📺 Canales en Vivo
        </Link>
      </div>

      {/* Argentina Carousel */}
      <FanatizCarousel titulo='Fútbol Argentino' partidos={argentina} />

      {/* Otros - Grid principal */}
      <div className='mb-12'>
        <h2 className='font-barlow text-2xl font-black uppercase tracking-[3px] text-white/40 italic mb-6 border-l-4 border-blue-600 pl-4'>
          Otras Entradas
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {otros.map(p => (
            <PostCard key={p.id} partido={p} />
          ))}
          {otros.length === 0 && (
            <div className='col-span-full text-center py-20 text-white/30 font-barlow text-xl tracking-widest uppercase bg-white/[0.02] rounded-3xl border border-dashed border-white/5'>
              No hay más partidos disponibles
            </div>
          )}
        </div>
      </div>

      {/* Banner bottom */}
      <div className='flex justify-center'>
        <div className='w-full max-w-[728px] h-[90px] bg-white/5 rounded-lg flex items-center justify-center text-white/20 text-xs tracking-widest uppercase border border-white/5'>
          Banner Publicitario 728×90
        </div>
      </div>
    </main>
  )
}
