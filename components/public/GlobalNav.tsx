'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Home, Tv2, Clock, MessageCircle, Activity, Menu, X, Radio } from 'lucide-react'

export default function GlobalNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className='sticky top-0 z-50 w-full bg-[#060d1a]/95 backdrop-blur-md border-b border-white/10 shadow-lg'>
      <div className='max-w-[1400px] mx-auto px-4'>
        {/* Desktop Menu & Mobile Header */}
        <div className='flex items-center justify-between py-3'>
          {/* Logo / Brand for mobile */}
          <div className='md:hidden font-barlow text-xl font-black italic tracking-widest text-white'>
            VERFÚTBOL
          </div>

          {/* Hamburger Toggle */}
          <button 
            className='md:hidden text-white/70 hover:text-white p-2 transition-colors'
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Desktop Links */}
          <div className='hidden md:flex flex-wrap items-center justify-center gap-4 w-full'>
            <Link href='/' className='inline-flex items-center gap-2 text-white/70 hover:text-white text-[13px] font-black tracking-wider uppercase px-4 py-2 rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10'>
              <Home size={16} /> Inicio
            </Link>
            <Link href='/canales' className='inline-flex items-center gap-2 text-white/70 hover:text-white text-[13px] font-black tracking-wider uppercase px-4 py-2 rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10'>
              <Tv2 size={16} /> Canales en Vivo
            </Link>
            <Link href='/calendario' className='inline-flex items-center gap-2 text-white/70 hover:text-white text-[13px] font-black tracking-wider uppercase px-4 py-2 rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10'>
              <Clock size={16} /> Agenda Deportiva
            </Link>
            <Link href='/en-vivo' className='inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-[13px] font-black tracking-wider uppercase px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 transition-colors hover:bg-red-500/20'>
              <Radio size={16} className='animate-pulse' /> Partidos en Vivo
            </Link>
            <Link href='/marcadores' className='inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-[13px] font-black tracking-wider uppercase px-4 py-2 rounded-lg border border-blue-500/30 bg-blue-500/10 transition-colors hover:bg-blue-500/20'>
              <Activity size={16} /> Marcadores
            </Link>
            <a href='#' className='inline-flex items-center gap-2 text-white/70 hover:text-[#0088cc] text-[13px] font-black tracking-wider uppercase px-4 py-2 rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-[#0088cc]/10 hover:border-[#0088cc]/30'>
              <MessageCircle size={16} /> Telegram
            </a>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className='md:hidden flex flex-col gap-2 pb-5 pt-2 border-t border-white/10 animate-fade-in'>
            <Link href='/' onClick={() => setIsOpen(false)} className='flex items-center gap-3 text-white/80 hover:text-white text-sm font-black tracking-wider uppercase px-4 py-3.5 rounded-lg bg-white/5 border border-white/5'>
              <Home size={18} /> Inicio
            </Link>
            <Link href='/canales' onClick={() => setIsOpen(false)} className='flex items-center gap-3 text-white/80 hover:text-white text-sm font-black tracking-wider uppercase px-4 py-3.5 rounded-lg bg-white/5 border border-white/5'>
              <Tv2 size={18} /> Canales en Vivo
            </Link>
            <Link href='/calendario' onClick={() => setIsOpen(false)} className='flex items-center gap-3 text-white/80 hover:text-white text-sm font-black tracking-wider uppercase px-4 py-3.5 rounded-lg bg-white/5 border border-white/5'>
              <Clock size={18} /> Agenda Deportiva
            </Link>
            <Link href='/en-vivo' onClick={() => setIsOpen(false)} className='flex items-center gap-3 text-red-400 text-sm font-black tracking-wider uppercase px-4 py-3.5 rounded-lg bg-red-500/10 border border-red-500/20'>
              <Radio size={18} className='animate-pulse' /> Partidos en Vivo
            </Link>
            <Link href='/marcadores' onClick={() => setIsOpen(false)} className='flex items-center gap-3 text-blue-400 text-sm font-black tracking-wider uppercase px-4 py-3.5 rounded-lg bg-blue-500/10 border border-blue-500/20'>
              <Activity size={18} /> Marcadores
            </Link>
            <a href='#' className='flex items-center gap-3 text-[#0088cc] text-sm font-black tracking-wider uppercase px-4 py-3.5 rounded-lg bg-[#0088cc]/10 border border-[#0088cc]/20'>
              <MessageCircle size={18} /> Telegram
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
