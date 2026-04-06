import Link from 'next/link'
import { Home, Tv2, Clock, MessageCircle } from 'lucide-react'

export default function GlobalNav() {
  return (
    <nav className='sticky top-0 z-50 w-full bg-[#060d1a]/95 backdrop-blur-md border-b border-white/10 shadow-lg'>
      <div className='max-w-[1400px] mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-2 sm:gap-4'>
        <Link href='/' className='inline-flex items-center gap-2 text-white/70 hover:text-white text-[11px] sm:text-[13px] font-black tracking-wider uppercase px-4 py-2 rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10'>
          <Home size={16} /> Inicio
        </Link>
        <Link href='/canales' className='inline-flex items-center gap-2 text-white/70 hover:text-white text-[11px] sm:text-[13px] font-black tracking-wider uppercase px-4 py-2 rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10'>
          <Tv2 size={16} /> Canales en Vivo
        </Link>
        <Link href='/calendario' className='inline-flex items-center gap-2 text-white/70 hover:text-white text-[11px] sm:text-[13px] font-black tracking-wider uppercase px-4 py-2 rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10'>
          <Clock size={16} /> Agenda Deportiva
        </Link>
        <a href='#' className='inline-flex items-center gap-2 text-white/70 hover:text-[#0088cc] text-[11px] sm:text-[13px] font-black tracking-wider uppercase px-4 py-2 rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-[#0088cc]/10 hover:border-[#0088cc]/30'>
          <MessageCircle size={16} /> Telegram
        </a>
      </div>
    </nav>
  )
}
