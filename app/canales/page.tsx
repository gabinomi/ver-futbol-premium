'use client'
import { useState, useRef } from 'react'
import GlobalNav from '@/components/public/GlobalNav'
import { Play, Signal, Zap, Star, RotateCw, X } from 'lucide-react'
import { CANALES, getEnlace, getEnlaceHD } from '@/lib/canales-data'

const SMARTLINK = 'https://www.profitablecpmratenetwork.com/werazu5j?key=91427af14d8002e45221edbb97a3cf92'

export default function CanalesPage() {
  const [canalActivo, setCanalActivo] = useState<number | null>(null)
  const [modo, setModo] = useState<1 | 2 | 3>(1)
  const [iframeSrc, setIframeSrc] = useState('')
  const [showOverlay, setShowOverlay] = useState(true)
  const playerRef = useRef<HTMLDivElement>(null)

  function abrirCanal(idx: number) {
    setCanalActivo(idx)
    setModo(1)
    setIframeSrc('')
    setShowOverlay(true)
    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  function confirmarClick() {
    if (canalActivo === null) return
    window.open(SMARTLINK, '_blank')
    setShowOverlay(false)
    const canal = CANALES[canalActivo]
    const src = modo === 3 ? getEnlaceHD(canal) : getEnlace(canal, modo)
    setIframeSrc(src || getEnlace(canal, 1))
  }

  function cambiarModo(m: 1 | 2 | 3) {
    if (canalActivo === null) return
    setModo(m)
    if (!showOverlay) {
      const canal = CANALES[canalActivo]
      const src = m === 3 ? getEnlaceHD(canal) : getEnlace(canal, m)
      if (src) setIframeSrc(src)
    }
  }

  function recargar() {
    if (!iframeSrc) return
    const current = iframeSrc
    setIframeSrc('')
    setTimeout(() => setIframeSrc(current), 150)
  }

  function cerrarPlayer() {
    setCanalActivo(null)
    setIframeSrc('')
    setShowOverlay(true)
  }

  const canalData = canalActivo !== null ? CANALES[canalActivo] : null

  function renderFilaCanales(indices: number[], label: string) {
    return (
      <div>
        <div className='text-[10px] font-bold tracking-[2px] uppercase text-white/20 mb-2 pl-1'>{label}</div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          {indices.map(idx => {
            const canal = CANALES[idx]
            if (!canal) return null
            return (
              <div
                key={idx}
                onClick={() => abrirCanal(idx)}
                className={`relative flex flex-col items-center justify-between p-4 h-[155px] rounded-xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                  canalActivo === idx
                    ? 'border-red-500 shadow-[0_0_0_2px_rgba(220,38,38,0.3),0_4px_20px_rgba(220,38,38,0.15)] bg-[#081024]'
                    : 'border-white/[0.07] hover:border-blue-500/50 hover:shadow-[0_4px_20px_rgba(37,99,235,0.15)] bg-[#070b16cc]'
                }`}
              >
                {/* Live badge */}
                <span className='absolute top-2 right-2 flex items-center gap-1 bg-red-600/15 border border-red-600/40 text-red-400 px-1.5 py-0.5 rounded-full text-[7px] font-bold tracking-widest uppercase'>
                  <span className='w-1 h-1 bg-red-500 rounded-full animate-blink' /> VIVO
                </span>

                {/* Logo */}
                <div className='w-16 h-11 flex items-center justify-center mt-1'>
                  <img src={canal.img} alt={canal.nombre} className='max-w-full max-h-full object-contain brightness-90' loading='lazy' />
                </div>

                {/* Name - fixed single line */}
                <span className='font-barlow text-[13px] font-extrabold uppercase tracking-wide text-slate-300 text-center leading-tight truncate w-full'>{canal.nombre}</span>

                {/* CTA - always at bottom */}
                <div className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-barlow font-bold uppercase tracking-wide border transition-all ${
                  canalActivo === idx
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-blue-600/12 border-blue-600/35 text-blue-400'
                }`}>
                  <Play size={10} fill='currentColor' /> Ver Canal
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className='relative z-10 flex flex-col min-h-screen'>
      <GlobalNav />
      <main className='max-w-[1400px] w-full mx-auto px-4 py-6 flex flex-col flex-1'>

        {/* Banner Top */}
        <div className='flex justify-center mb-6'>
          <div className='w-full max-w-[728px] h-[90px] bg-white/5 rounded-lg flex items-center justify-center text-white/20 text-xs tracking-widest uppercase border border-white/5'>
            Banner 728×90
          </div>
        </div>

        <div className='flex gap-5 max-w-[1200px] mx-auto w-full items-start justify-center'>

          {/* Lateral Izq */}
          <aside className='hidden xl:block w-40 flex-shrink-0 sticky top-24 self-start'>
            <div className='w-40 h-[600px] bg-white/5 rounded-xl flex items-center justify-center text-white/10 text-[10px] font-black tracking-[4px] uppercase border border-white/5'>
              160×600
            </div>
          </aside>

          {/* Centro */}
          <div className='flex-1 min-w-0 max-w-[900px] flex flex-col gap-5'>

            {/* ═══ REPRODUCTOR (visible solo cuando hay canal activo) ═══ */}
            {canalData && (
              <div ref={playerRef} className='flex flex-col gap-3 animate-fade-in'>
                {/* Player Header */}
                <div className='flex items-center gap-3 bg-gradient-to-br from-[#0d2860] via-[#1746b8] to-[#1a3a9a] rounded-xl px-4 py-3'>
                  <div className='w-12 h-12 rounded-lg bg-white/10 p-1 flex items-center justify-center flex-shrink-0'>
                    <img src={canalData.img} alt={canalData.nombre} className='w-full h-full object-contain' />
                  </div>
                  <div>
                    <div className='font-barlow text-xl font-black uppercase tracking-wider text-white'>{canalData.nombre}</div>
                    <div className='text-[10px] text-white/50 tracking-[2px] uppercase'>Transmisión EN VIVO · 24/7</div>
                  </div>
                </div>

                {/* Player Wrap con Overlay */}
                <div className='relative rounded-xl overflow-hidden bg-black' style={{ aspectRatio: '16/9' }}>
                  {/* SmartLink Overlay */}
                  {showOverlay && (
                    <div
                      className='absolute inset-0 z-10 bg-[#040812]/95 flex flex-col items-center justify-center gap-5 cursor-pointer rounded-xl'
                      onClick={confirmarClick}
                    >
                      <div className='w-[72px] h-[72px] rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-[0_0_0_0_rgba(37,99,235,0.5)] animate-[slPulse_1.8s_ease-in-out_infinite]'>
                        <Play size={26} className='text-white ml-1' fill='white' />
                      </div>
                      <div className='font-barlow text-xl font-black uppercase tracking-wider text-white'>Hacé click para ver el canal</div>
                      <div className='text-xs text-slate-500 tracking-wider'>Tocá en cualquier parte para continuar</div>
                    </div>
                  )}
                  {iframeSrc && (
                    <iframe
                      src={iframeSrc}
                      className='absolute inset-0 w-full h-full border-none'
                      allow='encrypted-media; autoplay; picture-in-picture'
                      allowFullScreen
                      scrolling='no'
                      referrerPolicy='no-referrer'
                    />
                  )}
                </div>

                {/* Controles */}
                <div className='flex items-center gap-2 flex-wrap'>
                  <button
                    onClick={() => cambiarModo(1)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-barlow text-[13px] font-bold uppercase tracking-wide border transition-all ${
                      modo === 1 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/[0.06] border-white/10 text-slate-400 hover:bg-white/[0.12] hover:text-white'
                    }`}
                  >
                    <Signal size={12} /> Manual
                  </button>
                  <button
                    onClick={() => cambiarModo(2)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-barlow text-[13px] font-bold uppercase tracking-wide border transition-all ${
                      modo === 2 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/[0.06] border-white/10 text-slate-400 hover:bg-white/[0.12] hover:text-white'
                    }`}
                  >
                    <Zap size={12} /> Auto
                  </button>
                  {canalData.hd && (
                    <button
                      onClick={() => cambiarModo(3)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-barlow text-[13px] font-bold uppercase tracking-wide border transition-all ${
                        modo === 3 ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-white/[0.06] border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/15 hover:text-yellow-300'
                      }`}
                    >
                      <Star size={12} /> HD
                    </button>
                  )}
                  <button
                    onClick={recargar}
                    className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-barlow text-[13px] font-bold uppercase tracking-wide border border-red-600/30 text-red-400 hover:bg-red-600/15 hover:text-white bg-white/[0.06] transition-all'
                  >
                    <RotateCw size={12} /> Recargar
                  </button>
                  <button
                    onClick={cerrarPlayer}
                    className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-barlow text-[13px] font-bold uppercase tracking-wide border border-white/10 text-slate-400 hover:bg-white/[0.12] hover:text-white bg-white/[0.06] transition-all'
                  >
                    <X size={12} /> Cerrar
                  </button>
                </div>
              </div>
            )}

            {/* ═══ CANALES AGRUPADOS ═══ */}
            <div className='flex flex-col gap-6'>
              <div className='flex items-center gap-3'>
                <h1 className='font-barlow text-xl font-black uppercase tracking-[2px] text-white'>Canales Deportivos</h1>
                <span className='flex items-center gap-1.5 bg-red-600/15 border border-red-600/40 text-red-400 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase'>
                  <span className='w-[5px] h-[5px] bg-red-500 rounded-full animate-blink' /> EN VIVO
                </span>
              </div>

              {/* Fila 1: ESPN (0-3) */}
              {renderFilaCanales([0,1,2,3], 'ESPN')}
              {/* Fila 2: FOX 1,2,3 + TNT (4,5,6,14) */}
              {renderFilaCanales([4,5,6,14], 'FOX / TNT')}
              {/* Fila 3: TyC 7,8 + Win 12,13 */}
              {renderFilaCanales([7,8,12,13], 'TyC / Win Sports')}
              {/* Fila 4: DSports 9,10,11 */}
              {renderFilaCanales([9,10,11], 'DSports')}
            </div>
          </div>

          {/* Lateral Der */}
          <aside className='hidden xl:block w-40 flex-shrink-0 sticky top-24 self-start'>
            <div className='w-40 h-[600px] bg-white/5 rounded-xl flex items-center justify-center text-white/10 text-[10px] font-black tracking-[4px] uppercase border border-white/5'>
              160×600
            </div>
          </aside>

        </div>

        {/* Banner Bottom */}
        <div className='flex justify-center mt-auto py-8'>
          <div className='w-full max-w-[728px] h-[90px] bg-white/5 rounded-lg flex items-center justify-center text-white/20 text-xs tracking-widest uppercase border border-white/5'>
            Banner 728×90
          </div>
        </div>
      </main>
    </div>
  )
}
