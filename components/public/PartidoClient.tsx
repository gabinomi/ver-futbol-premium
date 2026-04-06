'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Partido } from '@/types'
import { Home, Play, Radio, Clock, Tv2, PlayCircle } from 'lucide-react'

interface Props {
  partido: Partido
  escudoLocal: string | null
  escudoVisitante: string | null
  horarios: [string, string][] | null
  links: { video: string | null; link1: string | null; link2: string | null; link3: string | null }
}

const estadoBadge = {
  'EN-VIVO': { label: 'EN VIVO', cls: 'bg-red-600 animate-pulse-red', dot: true },
  'PROXIMO': { label: 'PRÓXIMO', cls: 'bg-blue-600', dot: false },
  'FINALIZADO': { label: 'FINALIZADO', cls: 'bg-emerald-600', dot: false },
}

// Client-side shield fallback component
function TeamShield({ name, initialUrl }: { name: string; initialUrl: string | null }) {
  const [url, setUrl] = useState(initialUrl)

  useEffect(() => {
    if (!url) {
      fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(name)}`)
        .then(r => r.json())
        .then(data => {
          const team = data?.teams?.[0]
          if (team) {
            const badge = team.strBadge || team.strLogo || team.strTeamBadge || team.strTeamLogo
            if (badge) setUrl(badge)
          }
        })
        .catch(() => {})
    }
  }, [name, url])

  return (
    <div className='w-full h-full flex items-center justify-center p-1.5'>
      {url ? (
        <img src={url} alt={name} className='w-full h-full object-contain drop-shadow-sm' />
      ) : (
        <span className='font-barlow text-[10px] font-bold text-white/40 uppercase'>{name.substring(0, 3)}</span>
      )}
    </div>
  )
}

export default function PartidoClient({ partido, escudoLocal, escudoVisitante, horarios, links }: Props) {
  const badge = estadoBadge[partido.estado] || estadoBadge['PROXIMO']
  const imgVideo = partido.img_video || 'https://placehold.co/720x405/060d1a/1e40af?text=EN+VIVO'

  return (
    <main className='relative z-10 flex justify-center px-4 py-8 gap-10 max-w-[1400px] mx-auto'>

      {/* LATERAL IZQ - Banner Fijo */}
      <aside className='hidden xl:block w-40 flex-shrink-0 sticky top-12 self-start'>
        <div className='w-40 h-[600px] bg-white/5 rounded-xl flex items-center justify-center text-white/10 text-[10px] font-black tracking-[4px] uppercase border border-white/5 shadow-2xl backdrop-blur-md'>
          160×600
        </div>
      </aside>

      {/* CONTENIDO CENTRAL - COMPACTO (540px) */}
      <div className='flex-1 max-w-[540px] w-full flex flex-col gap-6 animate-fade-in'>

        {/* MENU Y NAVEGACIÓN RÁPIDA */}
        <div className='flex flex-wrap justify-center gap-2 xl:gap-3 mb-2'>
          <Link href='/' className='inline-flex items-center gap-1.5 text-white/50 hover:text-white text-[10px] font-black tracking-[2px] uppercase px-4 py-2 rounded-full border border-white/10 bg-white/5 transition-all outline-none hover:bg-white/10'>
            <Home size={12} /> Inicio
          </Link>
          <Link href='/canales' className='inline-flex items-center gap-1.5 text-white/50 hover:text-white text-[10px] font-black tracking-[2px] uppercase px-4 py-2 rounded-full border border-white/10 bg-white/5 transition-all outline-none hover:bg-white/10'>
            <Tv2 size={12} /> Canales en Vivo
          </Link>
          <Link href='/calendario' className='inline-flex items-center gap-1.5 text-white/50 hover:text-white text-[10px] font-black tracking-[2px] uppercase px-4 py-2 rounded-full border border-white/10 bg-white/5 transition-all outline-none hover:bg-white/10'>
            <Clock size={12} /> Agenda Deportiva
          </Link>
          {/* Botón de Telegram habilitado como placeholder, ya visible */}
          <button className='inline-flex items-center gap-1.5 text-white/50 hover:text-[#0088cc] text-[10px] font-black tracking-[2px] uppercase px-4 py-2 rounded-full border border-white/10 bg-white/5 transition-all outline-none hover:bg-[#0088cc]/10 hover:border-[#0088cc]/30'>
            Telegram
          </button>
        </div>

        {/* CARD PRINCIPAL - ESTILO PREMIUM */}
        <div className='rounded-[2.5rem] overflow-hidden border border-white/[0.08] bg-[#020810db] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl ring-1 ring-white/10'>

          {/* HEADER RIBBON */}
          <div className='bg-gradient-to-br from-[#0d2860] via-[#1746b8] to-[#1a3a9a] px-6 py-8 text-center relative overflow-hidden'>
            <div className='absolute inset-x-0 -top-12 h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent_70%)]' />
            <div className='relative z-10'>
              <span className={`inline-flex items-center gap-2 ${badge.cls} text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-[2px] uppercase mb-4 shadow-lg ring-1 ring-white/20`}>
                {badge.dot && <span className='w-2 h-2 bg-white rounded-full animate-blink' />}
                {badge.label}
              </span>
              <h1 className='font-barlow text-3xl font-black tracking-[4px] uppercase text-white drop-shadow-2xl italic'>
                FÚTBOL EN DIRECTO
              </h1>
            </div>
          </div>

          {/* MATCH HERO - CINTAS ESTILO BLOGGER */}
          <div className='match-hero flex items-center justify-center py-6 px-4 bg-gradient-to-b from-[#0d286088] to-transparent relative min-h-[90px]'>
            <div className='absolute inset-x-0 top-1/2 -translate-y-1/2 h-[45px] bg-[#1746b8] opacity-60 ribbon-clip' />
            
            <div className='flex-1 text-center z-10 px-2'>
              <span className='font-barlow text-xl sm:text-2xl font-black uppercase tracking-wider text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] transition-all hover:scale-105 line-clamp-2'>
                {partido.equipo_local}
              </span>
            </div>

            <div className='vs-badge z-20 mx-4'>
              <span className='font-barlow text-2xl font-black text-white italic tracking-tighter'>VS</span>
            </div>

            <div className='flex-1 text-center z-10 px-2'>
              <span className='font-barlow text-xl sm:text-2xl font-black uppercase tracking-wider text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] transition-all hover:scale-105 line-clamp-2'>
                {partido.equipo_visitante}
              </span>
            </div>
          </div>

          {/* SCORE BAR COMPACTA */}
          <div className='flex items-center justify-center gap-6 px-8 py-5 bg-black/40 border-y border-white/5'>
            <div className='w-14 h-14 rounded-full bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 shadow-inner group hover:border-blue-500/50 transition-colors'>
              <TeamShield name={partido.equipo_local} initialUrl={escudoLocal} />
            </div>
            <div className='flex items-center gap-4 flex-1 justify-center scale-110'>
              <span className='font-barlow text-5xl font-black text-white leading-none min-w-10 text-center tracking-tighter drop-shadow-2xl'>{partido.gol_local}</span>
              <span className='font-barlow text-3xl font-bold text-white/20 italic'>-</span>
              <span className='font-barlow text-5xl font-black text-white leading-none min-w-10 text-center tracking-tighter drop-shadow-2xl'>{partido.gol_visitante}</span>
            </div>
            <div className='w-14 h-14 rounded-full bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 shadow-inner group hover:border-blue-500/50 transition-colors'>
              <TeamShield name={partido.equipo_visitante} initialUrl={escudoVisitante} />
            </div>
          </div>

          {/* CONTENIDO INTERNO */}
          <div className='px-6 py-6 flex flex-col gap-5'>

            {/* BARRA RESULTADO FINAL (Oculta si no es Finalizado) */}
            {partido.estado === 'FINALIZADO' && (
              <div className='flex items-center justify-center gap-3 bg-red-600/10 border border-red-600/20 py-3 rounded-2xl'>
                <span className='text-[10px] font-black uppercase tracking-[3px] text-red-400'>Resultado Final</span>
              </div>
            )}

            {/* VIDEO THUMBNAIL */}
            <a href={links.video || '#'} target='_blank' rel='noopener'
              className='relative block rounded-3xl overflow-hidden border border-white/10 aspect-video bg-black cursor-pointer group shadow-2xl'>
              <Image src={imgVideo} alt='Ver partido' fill className='object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out' />
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-20 h-20 rounded-full bg-black/40 backdrop-blur-md border-2 border-white/40 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-white transition-all transform group-hover:scale-110 duration-500'>
                  <Play size={28} className='text-white ml-1 fill-white shadow-white group-hover:scale-125 transition-transform' />
                </div>
              </div>
              {partido.estado === 'EN-VIVO' && (
                <div className='absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black tracking-[2px] px-3 py-1 rounded-lg flex items-center gap-2 uppercase shadow-lg ring-1 ring-white/20 animate-pulse-red'>
                  <span className='w-2 h-2 bg-white rounded-full animate-blink' /> EN VIVO
                </div>
              )}
            </a>

            {/* INFO CANALES */}
            {partido.canales && (
              <div className='flex items-center gap-4 bg-white/5 border border-dashed border-blue-500/30 rounded-2xl px-5 py-4 text-sm group hover:bg-blue-500/5 transition-colors'>
                <Tv2 size={20} className='text-blue-500 flex-shrink-0 animate-pulse' />
                <span className='font-medium text-slate-300 tracking-wide text-[14px] sm:text-[16px] leading-relaxed'>{partido.canales}</span>
              </div>
            )}

            {/* HORARIOS */}
            {partido.estado !== 'FINALIZADO' && horarios && (
              <div className='bg-white/[0.03] rounded-[2rem] px-6 py-6 border border-white/[0.05]'>
                <div className='flex items-center gap-3 text-[11px] uppercase tracking-[3px] text-white/30 font-black mb-5'>
                  <Clock size={16} className='text-white/20' />
                  Horarios por país
                </div>
                <div className='grid grid-cols-2 gap-x-8'>
                  {horarios.map(([pais, hora]) => (
                    <div key={pais} className='flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0 group'>
                      <span className='text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-400/70 transition-colors'>{pais}</span>
                      <span className='font-barlow font-black text-lg text-slate-200 group-hover:text-white transition-colors'>{hora}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACCIÓN PRINCIPAL - COMPACTA Y PODEROSA */}
            {links.link1 && (
              <div className='relative pt-4'>
                <div className='flex items-center text-[10px] uppercase tracking-[3px] text-white/20 font-black mb-4 gap-4'>
                  <span className='flex-1 h-px bg-white/5' />
                  Ver transmisión
                  <span className='flex-1 h-px bg-white/5' />
                </div>
                <a href={links.link1} target='_blank' rel='noopener'
                  className='relative flex items-center justify-center gap-4 w-full bg-gradient-to-br from-blue-600 to-blue-800 text-white py-5 rounded-[1.5rem] font-barlow text-2xl font-black tracking-[2px] uppercase overflow-hidden shadow-[0_15px_40px_-10px_rgba(37,99,235,0.6)] group hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 transform-gpu'>
                  <PlayCircle size={28} className='flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500' />
                  <span className='drop-shadow-lg italic'>VER TRANSMISIÓN HD</span>
                  {/* Animación local de brillo usando Before en vez de clases problemáticas globales */}
                  <div className='absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:animate-[shimmer_1.5s_ease-in-out_infinite] pointer-events-none' />
                </a>
              </div>
            )}

            {/* BOTONES ALTERNATIVOS GRID */}
            {(links.link2 || links.link3) && (
              <div className='grid grid-cols-2 gap-4'>
                {links.link2 && (
                  <a href={links.link2} target='_blank' rel='noopener'
                    className='flex flex-col items-center justify-center gap-1 bg-white/5 border border-white/5 text-white/50 hover:bg-blue-600/20 hover:border-blue-600/40 hover:text-white py-4 rounded-2xl font-barlow text-[13px] font-black tracking-widest uppercase transition-all duration-300 shadow-lg group'>
                    <Radio size={20} className='text-white/20 transition-all' /> 
                    <span>Opción 2</span>
                  </a>
                )}
                {links.link3 && (
                  <a href={links.link3} target='_blank' rel='noopener'
                    className='flex flex-col items-center justify-center gap-1 bg-white/5 border border-white/5 text-white/50 hover:bg-blue-600/20 hover:border-blue-600/40 hover:text-white py-4 rounded-2xl font-barlow text-[13px] font-black tracking-widest uppercase transition-all duration-300 shadow-lg group'>
                    <Radio size={20} className='text-white/20 group-hover:text-blue-400 group-hover:animate-pulse transition-all' /> 
                    <span>Opción 3</span>
                  </a>
                )}
              </div>
            )}

            {/* BOTÓN VER CANALES */}
            <a href='/canales' target='_blank' rel='noopener'
              className='relative flex items-center justify-center gap-4 w-full bg-gradient-to-br from-red-600 to-red-800 text-white py-4 rounded-[1.5rem] font-barlow text-xl font-black tracking-[2px] uppercase overflow-hidden shadow-[0_15px_35px_-5px_rgba(220,38,38,0.5)] group hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 transform-gpu'>
              <span className='w-2 h-2 bg-white rounded-full animate-blink flex-shrink-0' />
              <Play size={18} className='fill-white group-hover:scale-110 transition-transform duration-500' />
              <span className='drop-shadow-lg'>Ver Canales EN VIVO</span>
              {/* Brillo inline seguro */}
              <div className='absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:animate-[shimmer_1.5s_ease-in-out_infinite] pointer-events-none' />
            </a>

            {/* BOTÓN INICIO (VISIBLE EN DESKTOP ABAJO) */}
            <div className='hidden xl:flex justify-center mt-2'>
              <Link href='/' className='inline-flex items-center gap-2 text-white/20 hover:text-white/80 text-[10px] font-black tracking-[3px] uppercase px-6 py-3 rounded-xl border border-white/5 bg-white/3 transition-all active:scale-95 hover:bg-white/5'>
                <Home size={14} /> Volver al Inicio
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* LATERAL DER - Banner Fijo */}
      <aside className='hidden xl:block w-40 flex-shrink-0 sticky top-12 self-start'>
        <div className='w-40 h-[600px] bg-white/5 rounded-xl flex items-center justify-center text-white/10 text-[10px] font-black tracking-[4px] uppercase border border-white/5 shadow-2xl backdrop-blur-md'>
          160×600
        </div>
      </aside>

    </main>
  )
}
