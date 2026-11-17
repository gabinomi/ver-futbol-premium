'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Tv2, Activity, Radio, Plus } from 'lucide-react'

export default function GlobalNav() {
  const pathname = usePathname()
  const [liveCount, setLiveCount] = useState<number>(0)

  useEffect(() => {
    const fetchLiveCount = async () => {
      try {
        const res = await fetch('/api/eventos', { cache: 'no-store' })
        const data = await res.json()
        if (Array.isArray(data)) {
          // Agrupar por partido (título + hora) para contar partidos únicos en vivo igual que GlobalFABs
          const gruposMap: Record<string, string> = {}
          data.forEach((e: any) => {
            const key = `${e.title}|${e.time}`
            if (!gruposMap[key] || e.status === 'en vivo') {
              gruposMap[key] = e.status
            }
          })
          const count = Object.values(gruposMap).filter(st => st === 'en vivo').length
          setLiveCount(count)
        }
      } catch {
        // Ignorar errores de red temporales
      }
    }

    fetchLiveCount()
    const interval = setInterval(fetchLiveCount, 45000)
    return () => clearInterval(interval)
  }, [])

  const isCal = pathname === '/calendario'
  const isCan = pathname.startsWith('/canales')
  const isEnv = pathname === '/en-vivo'
  const isMrc = pathname === '/marcadores'

  return (
    <>
      {/* ══════════════════════════════════════════════
          NAVBAR PRINCIPAL (PC & HEADER MÓVIL)
          ══════════════════════════════════════════════ */}
      <nav className='sticky top-0 z-50 w-full bg-[#060d1a]/95 backdrop-blur-md border-b border-white/10 shadow-lg h-[58px]'>
        <div className='max-w-[1400px] h-full mx-auto px-4 flex items-center justify-between'>
          {/* Logo (PC y Móvil) */}
          <Link href='/' className='flex items-center h-full flex-shrink-0'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='https://i.imgur.com/96IXkPJ.png'
              alt='Ver Fútbol EN VIVO'
              className='h-[42px] md:h-[48px] w-auto object-contain'
            />
          </Link>

          {/* Menú Superior en PC */}
          <div className='hidden md:flex items-center gap-2 lg:gap-3 flex-1 justify-center max-w-[900px]'>
            <Link
              href='/calendario'
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-barlow text-[13px] font-bold uppercase tracking-wider transition-colors ${
                isCal
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <CalendarDays size={16} /> Agenda
            </Link>

            <Link
              href='/canales'
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-barlow text-[13px] font-bold uppercase tracking-wider transition-colors ${
                isCan
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Tv2 size={16} /> Canales
            </Link>

            <Link
              href='/marcadores'
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-barlow text-[13px] font-bold uppercase tracking-wider transition-colors ${
                isMrc
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Activity size={16} /> Marcadores
            </Link>

            <a
              href='#'
              className='inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-barlow text-[13px] font-bold uppercase tracking-wider transition-colors text-sky-400/90 hover:text-sky-300 hover:bg-sky-500/10 border border-transparent hover:border-sky-500/20'
            >
              <svg className='w-4 h-4 fill-current' viewBox='0 0 24 24'>
                <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z'/>
              </svg>
              Comunidad
            </a>

            <Link
              href='/en-vivo'
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-barlow text-[13px] font-black uppercase tracking-wider transition-all ${
                isEnv
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-500'
                  : 'bg-red-600/15 text-red-400 hover:bg-red-600/25 border border-red-500/40'
              }`}
            >
              <span className='w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse' />
              EN VIVO
              {liveCount > 0 && (
                <span className='bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black leading-none ml-0.5'>
                  {liveCount}
                </span>
              )}
            </Link>
          </div>

          {/* Botón "+ Canales" (PC y Móvil a la derecha) */}
          <div className='flex items-center'>
            <a
              href='https://tvplus-envivo.blogspot.com/'
              target='_blank'
              rel='noopener noreferrer'
              className='btn-mascanales px-3 py-1.5 md:px-3.5 md:py-1.5 text-[12px] md:text-[13px] font-black'
            >
              <Plus size={14} className='stroke-[3]' />
              Canales
            </a>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════
          MENÚ INFERIOR MÓVIL FIJO (BOTTOM NAV)
          ══════════════════════════════════════════════ */}
      <nav className='md:hidden fixed left-0 right-0 bottom-0 z-[9000] flex items-end justify-around px-1 pb-[env(safe-area-inset-bottom,0px)] min-h-[calc(60px+env(safe-area-inset-bottom,0px))] bg-[#060d1a]/98 border-t border-white/10 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.65)] select-none'>
        {/* Agenda */}
        <Link
          href='/calendario'
          className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-barlow font-bold tracking-wider uppercase transition-colors ${
            isCal ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CalendarDays size={20} className='flex-shrink-0' />
          <span>Agenda</span>
        </Link>

        {/* Canales */}
        <Link
          href='/canales'
          className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-barlow font-bold tracking-wider uppercase transition-colors ${
            isCan ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tv2 size={20} className='flex-shrink-0' />
          <span>Canales</span>
        </Link>

        {/* EN VIVO (Centro, elevado y con pulso) */}
        <Link
          href='/en-vivo'
          className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 pt-0 pb-1.5 transition-transform ${
            isEnv ? 'text-white scale-105' : liveCount > 0 ? 'text-red-400' : 'text-slate-400'
          }`}
        >
          <div
            className={`relative w-[54px] h-[54px] rounded-full -mt-5 flex items-center justify-center text-white border-[3px] border-[#060d1a] transition-all ${
              liveCount > 0
                ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_0_1px_rgba(220,38,38,0.55),0_6px_20px_rgba(220,38,38,0.55)] animate-[bnPulse_2.2s_ease-in-out_infinite]'
                : 'bg-gradient-to-br from-[#7f2a2a] to-[#4b1414] shadow-[0_0_0_1px_rgba(220,38,38,0.25)]'
            }`}
          >
            <svg height='26' viewBox='0 0 500 500' width='26' xmlns='http://www.w3.org/2000/svg'>
              <g fill='none' stroke='#ffffff' strokeLinecap='round'>
                <circle cx='250' cy='250' fill='#ffffff' r='62.5' stroke='none' />
                <path d='M 175 145 A 130 130 0 0 0 175 355' strokeWidth='42' />
                <path d='M 325 145 A 130 130 0 0 1 325 355' strokeWidth='42' />
                <path d='M 115 85 A 205 205 0 0 0 115 415' strokeWidth='46' />
                <path d='M 385 85 A 205 205 0 0 1 385 415' strokeWidth='46' />
              </g>
            </svg>
            <span
              className={`absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full font-barlow text-[12px] font-black flex items-center justify-center leading-none border-2 border-[#060d1a] shadow-md ${
                liveCount > 0 ? 'bg-white text-red-600' : 'bg-slate-700 text-slate-300'
              }`}
            >
              {liveCount}
            </span>
          </div>
          <span className='font-barlow text-[11px] font-black tracking-wider uppercase mt-0.5'>
            EN VIVO
          </span>
        </Link>

        {/* Marcadores */}
        <Link
          href='/marcadores'
          className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-barlow font-bold tracking-wider uppercase transition-colors ${
            isMrc ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity size={20} className='flex-shrink-0' />
          <span>Marcadores</span>
        </Link>

        {/* Comunidad (Telegram) */}
        <a
          href='#'
          className='flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-barlow font-bold tracking-wider uppercase text-slate-400 hover:text-sky-400 transition-colors'
        >
          <svg className='w-5 h-5 fill-current' viewBox='0 0 24 24'>
            <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z'/>
          </svg>
          <span>Comunidad</span>
        </a>
      </nav>
    </>
  )
}
