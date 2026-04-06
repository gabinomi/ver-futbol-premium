'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Canal {
  id: string
  name: string
  url: string
  image: string
}

export default function CanalesPage() {
  const [canales, setCanales] = useState<Canal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/canales')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setCanales(data.canales)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError(true)
        setLoading(false)
      })
  }, [])

  return (
    <main className='relative z-10 flex flex-col min-h-screen max-w-[1400px] mx-auto px-4 py-8'>
      <div className='flex justify-center mb-8'>
        <div className='w-full max-w-[728px] h-[90px] bg-white/5 rounded-lg flex items-center justify-center text-white/20 text-xs tracking-widest uppercase'>Banner 728×90</div>
      </div>

      <div className='flex flex-col items-center mb-10'>
        <h1 className='font-barlow text-4xl font-black uppercase tracking-[3px] text-white/90 drop-shadow-md mb-2'>
          Canales en Vivo HD
        </h1>
      </div>

      {loading ? (
        <div className='flex justify-center my-20'>
          <p className='text-slate-400 font-barlow tracking-wider uppercase'>Cargando canales deportivos...</p>
        </div>
      ) : error ? (
        <div className='flex justify-center my-20'>
          <p className='text-red-400 font-barlow tracking-wider uppercase border border-red-500/20 bg-red-600/10 px-6 py-4 rounded-xl'>
            No se pudo obtener la lista de canales.
          </p>
        </div>
      ) : canales.length === 0 ? (
        <div className='flex justify-center my-20'>
          <p className='text-slate-400 font-barlow tracking-wider uppercase'>No hay canales disponibles por ahora.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1100px] mx-auto w-full'>
          {canales.map((canal) => {
            const redirUrl = `/embed?url=${encodeURIComponent(canal.url)}&t=${encodeURIComponent(canal.name)}&img=${encodeURIComponent(canal.image)}`
            return (
              <Link 
                key={canal.id} 
                href={redirUrl}
                className='flex flex-col items-center justify-center bg-[#070b16] border hover:border-slate-500/50 border-white/10 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:-translate-y-1'
              >
                {/* Header de procedencia extra si quieres - emulando la etiqueta superior gris */}
                <div className='text-[9px] font-bold tracking-[2px] uppercase text-white/20 mb-3'>
                  {canal.name.split(' ')[0]}
                </div>

                {/* Logo section */}
                <div className='relative w-28 h-28 mb-5 rounded-full border border-white/10 flex items-center justify-center bg-transparent overflow-hidden p-[18px]'>
                  <img src={canal.image} alt={canal.name} className='w-full h-full object-contain filter brightness-110 drop-shadow-md' />
                </div>

                {/* Info section */}
                <h3 className='font-barlow text-[22px] font-black uppercase text-slate-200 tracking-wide mb-3 text-center'>
                  {canal.name}
                </h3>
                
                <div className='flex items-center gap-2'>
                  <span className='w-[7px] h-[7px] rounded-full bg-emerald-500 animate-pulse drop-shadow-[0_0_4px_rgba(16,185,129,0.8)]' />
                  <span className='text-[12px] font-bold tracking-widest text-emerald-500 uppercase'>
                    EN VIVO
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <div className='flex justify-center mt-auto py-10'>
        <div className='w-full max-w-[728px] h-[90px] bg-white/5 rounded-lg flex items-center justify-center text-white/20 text-xs tracking-widest uppercase'>Banner 728×90</div>
      </div>
    </main>
  )
}
