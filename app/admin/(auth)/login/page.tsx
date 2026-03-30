'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ShieldCheck, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/admin/partidos')
      } else {
        setError('Contraseña incorrecta')
        setLoading(false)
      }
    } catch {
      setError('Error de conexión')
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden font-barlow'>
      {/* Mesh Gradients Animados */}
      <div className='absolute inset-0 bg-mesh opacity-40' />
      <div className='absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse' />
      <div className='absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse' style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className='w-full max-w-md glass-panel rounded-[2.5rem] p-10 relative z-10 mx-4'
      >
        <div className='text-center mb-10'>
          <div className='relative inline-block'>
            <div className='w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mb-6 mx-auto border border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.2)]'>
              <ShieldCheck size={40} className='text-blue-500' />
            </div>
            <div className='absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#060d1a] animate-pulse' />
          </div>
          
          <h1 className='text-4xl font-black uppercase tracking-[0.2em] text-white italic leading-none'>
            Admin <span className='text-blue-500 not-italic'>Panel</span>
          </h1>
          <p className='text-slate-500 text-[10px] font-black uppercase tracking-[4px] mt-3'>Ver Fútbol EN VIVO — V2.0</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div className='relative group'>
            <div className='absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors'>
              <Lock size={18} />
            </div>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='Ingresá la llave maestra'
              className='w-full bg-black/40 border border-white/10 rounded-2xl pl-14 pr-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm'
              required
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className='text-red-400 text-[10px] font-black uppercase tracking-widest text-center'
              >
                ⚠ {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button 
            type='submit' 
            disabled={loading}
            className='relative w-full group overflow-hidden bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[3px] py-4 rounded-2xl transition-all shadow-2xl shadow-blue-900/40 active:scale-[0.98] disabled:opacity-50'
          >
            <div className='relative z-10 flex items-center justify-center gap-3'>
              {loading ? <Loader2 size={18} className='animate-spin' /> : 'Acceder al Sistema'}
            </div>
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000' />
          </button>
        </form>

        <p className='text-center mt-8 text-[9px] font-bold text-slate-600 uppercase tracking-widest'>
          Acceso Restringido — Solo Personal Autorizado
        </p>
      </motion.div>
    </div>
  )
}

// Necesario importar AnimatePresence ya que lo estoy usando en el error
import { AnimatePresence } from 'framer-motion'
