'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef, Suspense } from 'react'
import { Play } from 'lucide-react'
import GlobalNav from '@/components/public/GlobalNav'

const DURACION = 15
const MSGS = [
  'El botón se activa al finalizar',
  'Preparando la transmisión...',
  'Verificando disponibilidad...',
  'Listo para reproducir'
]

// Imagen por defecto para eventos de la Agenda Deportiva
const IMG_DEFAULT_AGENDA = 'https://i.imgur.com/NwU54jR.jpeg'

function EmbedContent() {
  const params = useSearchParams()
  const destUrl = params.get('url')
  const titulo = params.get('t') || 'Transmisión en vivo'
  const imgUrl = params.get('img') || IMG_DEFAULT_AGENDA

  const opt2 = params.get('opt2')
  const opt3 = params.get('opt3')
  const opt4 = params.get('opt4')

  const [remaining, setRemaining] = useState(DURACION)
  const [done, setDone] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [activeStream, setActiveStream] = useState<string | null>(destUrl)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const buildGlobal2 = (url: string | null) => {
    if (!url) return null
    return url.replace('global1.php', 'global2.php')
  }

  const startContador = () => {
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(intervalRef.current!)
          setDone(true)
          return 0
        }
        return r - 1
      })
    }, 1000)
  }

  useEffect(() => {
    if (!destUrl) return
    startContador()

    const onVisibility = () => {
      if (document.hidden) clearInterval(intervalRef.current!)
      else startContador()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearInterval(intervalRef.current!)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [destUrl])

  const handlePlayClick = () => {
    if (done) setShowPlayer(true)
  }

  const reloadIframe = () => {
    const current = activeStream
    setActiveStream(null)
    setTimeout(() => setActiveStream(current), 100)
  }

  const options: string[] = []
  if (opt2) options.push(opt2)
  if (opt3) options.push(opt3)
  if (opt4) options.push(opt4)

  const pct = remaining / DURACION
  const circumference = 201
  const offset = circumference * (1 - pct)
  const msgIdx = Math.min(Math.floor((1 - pct) * MSGS.length), MSGS.length - 1)

  return (
    <main className='relative z-10 flex flex-col min-h-screen'>
      <GlobalNav />

      {/* Banner top 728x90 */}
      <div className='flex justify-center py-2 px-4 bg-black/70 border-b border-white/5'>
        <div className='w-full max-w-[728px] h-[90px] bg-white/5 rounded flex items-center justify-center text-white/20 text-xs tracking-widest'>Banner 728×90</div>
      </div>

      <div className='flex flex-1 gap-4 max-w-[1400px] mx-auto w-full px-4 py-4 items-start justify-center'>
        {/* Lateral izquierdo */}
        <aside className='hidden xl:block w-36 flex-shrink-0 sticky top-6'>
          <div className='w-36 h-[600px] bg-white/5 rounded-xl flex items-center justify-center text-white/20 text-xs tracking-widest'>160×600</div>
        </aside>

        <div className='flex-1 max-w-[800px] flex flex-col gap-3'>

          {/* Header */}
          <div className='bg-gradient-to-br from-[#0d2860] via-[#1746b8] to-[#1a3a9a] rounded-xl px-4 py-4 text-center relative overflow-hidden'>
            <div className='absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.1),transparent_65%)]' />
            <h1 className='font-barlow text-xl font-black uppercase tracking-wide text-white relative z-10'>{decodeURIComponent(titulo)}</h1>
            <p className='font-barlow text-[10px] font-bold tracking-[3px] uppercase text-white/50 relative z-10'>Transmisión en vivo</p>
          </div>

          {!showPlayer ? (
            <>
              {/* 1. CONTADOR + BARRA — primero, arriba del video */}
              <div className='bg-black/30 rounded-xl px-4 py-3 border border-white/5'>
                <div className='flex items-center gap-4'>
                  {/* Círculo contador */}
                  <div className='relative w-16 h-16 flex-shrink-0'>
                    <svg className='w-16 h-16 -rotate-90' viewBox='0 0 80 80'>
                      <circle cx='40' cy='40' r='32' fill='none' stroke='rgba(255,255,255,0.06)' strokeWidth='5' />
                      <circle cx='40' cy='40' r='32' fill='none'
                        stroke={remaining <= 3 ? '#2563eb' : '#dc2626'}
                        strokeWidth='5' strokeLinecap='round'
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
                      />
                    </svg>
                    <div className='absolute inset-0 flex items-center justify-center font-barlow text-2xl font-black text-white'>
                      {done ? '✓' : remaining}
                    </div>
                  </div>
                  {/* Texto + barra */}
                  <div className='flex-1 flex flex-col gap-2'>
                    <p className='text-[11px] text-slate-400 font-bold uppercase tracking-widest'>
                      {done ? '¡Listo! Tocá el video o el botón para ver' : MSGS[msgIdx]}
                    </p>
                    {/* Barra de progreso */}
                    <div className='w-full h-1.5 bg-white/5 rounded-full overflow-hidden'>
                      <div className='h-full bg-gradient-to-r from-red-600 to-blue-600 rounded-full origin-left transition-transform duration-1000 linear'
                        style={{ transform: `scaleX(${1 - pct})` }} />
                    </div>
                    <p className='text-[10px] text-slate-600 uppercase tracking-wider'>
                      {done ? 'Transmisión lista' : `Espera ${remaining}s para activar`}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. VIDEO THUMBNAIL — en el medio */}
              <div
                className='relative rounded-xl overflow-hidden bg-black aspect-video cursor-pointer select-none border border-white/10'
                onClick={handlePlayClick}
              >
                <img src={imgUrl} alt='Thumb' className='w-full h-full object-cover opacity-75' />
                <div className='absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/35 hover:bg-black/50 transition-colors'>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center border-[3px] shadow-[0_0_40px_rgba(37,99,235,0.6)] transition-transform duration-200 ${done ? 'bg-blue-600/85 border-white/90 scale-100 hover:scale-110' : 'bg-slate-700/50 border-slate-500/50 scale-90 grayscale opacity-60'}`}>
                    <Play fill='currentColor' className='text-white w-7 h-7 ml-1' />
                  </div>
                  <div className='font-barlow text-sm font-extrabold tracking-[2px] uppercase text-white/85'>
                    {done ? 'Tocá para ver el partido' : 'Esperando tiempo...'}
                  </div>
                </div>
              </div>

              {/* 3. BOTÓN — debajo del video */}
              <button
                onClick={handlePlayClick}
                disabled={!done}
                className={`relative flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-barlow text-lg font-black tracking-[1.5px] uppercase overflow-hidden transition-all duration-400 ${
                  done
                    ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-[0_6px_22px_rgba(37,99,235,0.45)] cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed pointer-events-none filter brightness-50'
                }`}>
                <Play size={16} className='flex-shrink-0' />
                Ver transmisión en vivo
              </button>
            </>
          ) : (
            <>
              {/* iframe Container */}
              <div className='relative rounded-xl overflow-hidden bg-black aspect-video shadow-[0_0_30px_rgba(0,0,0,0.8)]'>
                {activeStream && (
                  <iframe
                    src={activeStream}
                    className='w-full h-full border-none'
                    allowFullScreen
                    allow='encrypted-media'
                    scrolling='no'
                  />
                )}
              </div>

              {/* Controles Iframe */}
              <div className='flex flex-wrap gap-2 py-1 items-center'>
                <button onClick={() => setActiveStream(destUrl)} className={`px-3 py-1.5 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider transition-colors ${activeStream === destUrl ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white'}`}>
                  Manual (Global 1)
                </button>
                <button onClick={() => setActiveStream(buildGlobal2(destUrl))} className={`px-3 py-1.5 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider transition-colors ${activeStream === buildGlobal2(destUrl) ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white'}`}>
                  Auto (Global 2)
                </button>
                <button onClick={reloadIframe} className='px-3 py-1.5 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider bg-white/5 text-red-400 border border-red-500/30 hover:bg-red-500/20 hover:text-white transition-colors'>
                  Recargar
                </button>
                <button onClick={() => setShowPlayer(false)} className='px-3 py-1.5 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider bg-white/5 text-slate-300 border border-white/10 hover:bg-white/20 hover:text-white transition-colors ml-auto'>
                  Cerrar
                </button>
              </div>

              {/* Opciones extra */}
              {options.length > 0 && (
                <div className='flex flex-col gap-2'>
                  <span className='text-[10px] font-bold tracking-[2px] uppercase text-slate-500'>Opciones de transmisión</span>
                  <div className='flex flex-wrap gap-2'>
                    {options.map((opt, i) => {
                      let sName = opt.split('stream=')[1] || `Opción ${i+2}`
                      sName = sName.replace(/_/g, ' ').toUpperCase()
                      return (
                        <button key={opt} onClick={() => setActiveStream(opt)} className={`px-3 py-1.5 rounded-lg text-xs font-barlow font-bold uppercase tracking-wider transition-colors ${activeStream === opt ? 'bg-blue-600 text-white' : 'bg-blue-600/10 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30 hover:text-white'}`}>
                          {sName}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Banner único al final: 300x250 en móvil / 728x90 en desktop */}
          <div className='flex justify-center w-full mt-2 pb-4'>
            <div className='w-[300px] h-[250px] bg-white/5 rounded-xl flex items-center justify-center text-white/20 text-xs tracking-widest md:hidden'>300×250</div>
            <div className='hidden md:flex w-full max-w-[728px] h-[90px] bg-white/5 rounded-xl items-center justify-center text-white/20 text-xs tracking-widest'>728×90</div>
          </div>

        </div>

        {/* Lateral derecho */}
        <aside className='hidden xl:block w-36 flex-shrink-0 sticky top-6'>
          <div className='w-36 h-[600px] bg-white/5 rounded-xl flex items-center justify-center text-white/20 text-xs tracking-widest'>160×600</div>
        </aside>
      </div>
    </main>
  )
}

export default function EmbedPage() {
  return (
    <Suspense>
      <EmbedContent />
    </Suspense>
  )
}
