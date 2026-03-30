import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, X, Info, Send } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
  title?: string
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, title?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'success', title?: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type, title }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className='fixed top-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none max-w-md w-full sm:w-[400px]'>
        <AnimatePresence mode='popLayout'>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)', transition: { duration: 0.2 } }}
              className={`pointer-events-auto relative overflow-hidden group flex items-start gap-4 p-5 rounded-[24px] border shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-3xl transition-all hover:scale-[1.02] ${
                t.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20'
                  : t.type === 'error'
                  ? 'bg-red-500/10 border-red-500/20'
                  : 'bg-blue-500/10 border-blue-500/20'
              }`}
            >
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] -z-10 opacity-30 ${
                t.type === 'success' ? 'bg-emerald-500' : t.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`} />

              <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border ${
                t.type === 'success'
                  ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                  : t.type === 'error'
                  ? 'bg-red-500/20 border-red-500/30 text-red-400'
                  : 'bg-blue-500/20 border-blue-500/30 text-blue-400'
              }`}>
                {t.type === 'success' ? <CheckCircle2 size={20} /> : t.type === 'error' ? <AlertCircle size={20} /> : <Info size={20} />}
              </div>

              <div className='flex-1 flex flex-col pt-0.5'>
                <div className='flex items-center justify-between mb-1'>
                  <span className={`text-[10px] font-black uppercase tracking-[2px] ${
                    t.type === 'success' ? 'text-emerald-500' : t.type === 'error' ? 'text-red-500' : 'text-blue-500'
                  }`}>
                    {t.title || (t.type === 'success' ? 'Éxito' : t.type === 'error' ? 'Error' : 'Aviso')}
                  </span>
                  <button
                    onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
                    className='text-slate-500 hover:text-white transition-colors p-1'
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className='text-sm font-bold text-white leading-relaxed tracking-tight'>{t.message}</p>
              </div>

              {/* Progress bar */}
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-1 ${
                  t.type === 'success' ? 'bg-emerald-500/50' : t.type === 'error' ? 'bg-red-500/50' : 'bg-blue-500/50'
                }`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
