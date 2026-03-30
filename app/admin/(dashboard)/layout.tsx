'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, Plus, LogOut, Settings, Globe, 
  ShieldCheck, ChevronLeft, ChevronRight, Pin, PinOff,
  Activity, BarChart3, Database
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isPinned, setIsPinned] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const navItems = [
    { href: '/admin/partidos', icon: LayoutDashboard, label: 'Partidos', sub: 'Gestión de eventos' },
    { href: '/admin/partidos/new', icon: Plus, label: 'Nuevo Partido', sub: 'Crear entrada' },
  ]

  const SidebarWidth = isPinned ? (isCollapsed ? 'w-24' : 'w-72') : (isHovered && isCollapsed ? 'w-72' : 'w-24')

  return (
    <div className='min-h-screen flex bg-[#020617] text-slate-300 font-barlow overflow-hidden'>
      {/* Background Orbs */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden -z-10'>
        <div className='absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full' />
        <div className='absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full' />
      </div>

      {/* Sidebar Wrapper */}
      <motion.aside 
        initial={false}
        animate={{ width: isPinned ? (isCollapsed ? 96 : 288) : (isHovered ? 288 : 96) }}
        onMouseEnter={() => !isPinned && setIsHovered(true)}
        onMouseLeave={() => !isPinned && setIsHovered(false)}
        className={`bg-[#081024cc] border-r border-white/5 flex flex-col backdrop-blur-2xl z-40 transition-shadow duration-500 ${!isPinned && isHovered ? 'shadow-[20px_0_50px_rgba(0,0,0,0.5)]' : ''}`}
      >
        {/* Logo Section */}
        <div className='px-6 py-8 flex items-center gap-4 overflow-hidden'>
          <div className='min-w-[48px] h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40 border border-blue-400/30'>
            <ShieldCheck size={26} className='text-white' />
          </div>
          <AnimatePresence>
            {(!isCollapsed || (!isPinned && isHovered)) && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className='flex flex-col whitespace-nowrap'
              >
                <span className='text-white font-black uppercase tracking-[2px] text-lg italic leading-tight'>Ver Fútbol</span>
                <span className='text-blue-500 font-bold uppercase tracking-[3px] text-[9px]'>Admin Station</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons (Collapse/Pin) */}
        <div className='px-6 mb-8 flex items-center justify-between gap-2 overflow-hidden'>
          <AnimatePresence>
            {(!isCollapsed || (!isPinned && isHovered)) && (
              <motion.button 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsPinned(!isPinned)}
                className={`p-2 rounded-xl border transition-all ${isPinned ? 'bg-blue-600/20 border-blue-600/40 text-blue-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                title={isPinned ? 'Desanclar Menú' : 'Anclar Menú'}
              >
                {isPinned ? <Pin size={16} /> : <PinOff size={16} />}
              </motion.button>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='p-2 bg-white/5 border border-white/10 text-slate-500 hover:text-white rounded-xl transition-all'
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className='flex-1 px-3 flex flex-col gap-2 overflow-hidden'>
          <p className='px-4 text-[9px] font-black uppercase tracking-[3px] text-slate-600 mb-2 truncate'>Navegación</p>
          {navItems.map((item) => {
            const Active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group overflow-hidden ${
                  Active 
                    ? 'bg-blue-600/10 text-white border border-blue-600/20 shadow-lg shadow-blue-900/10' 
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon size={22} className={`min-w-[22px] transition-colors ${Active ? 'text-blue-500 drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]' : 'group-hover:text-blue-400'}`} />
                <AnimatePresence>
                   {(!isCollapsed || (!isPinned && isHovered)) && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='flex flex-col whitespace-nowrap min-w-0'>
                        <span className='text-sm font-bold uppercase tracking-wider truncate'>{item.label}</span>
                        <span className={`text-[9px] font-medium transition-colors truncate ${Active ? 'text-blue-400/60' : 'text-slate-600 group-hover:text-slate-500'}`}>
                          {item.sub}
                        </span>
                     </motion.div>
                   )}
                </AnimatePresence>
                {Active && <div className='absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-600 rounded-full' />}
              </Link>
            )
          })}

          <div className='mt-8 flex flex-col gap-2'>
            <p className='px-4 text-[9px] font-black uppercase tracking-[3px] text-slate-600 mb-2 truncate'>Sistema</p>
            <Link href='#' className='flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all group border border-transparent overflow-hidden'>
              <Settings size={22} className='min-w-[22px] group-hover:text-blue-400 transition-colors' />
              <AnimatePresence>
                {(!isCollapsed || (!isPinned && isHovered)) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='flex flex-col whitespace-nowrap min-w-0'>
                    <span className='text-sm font-bold uppercase tracking-wider truncate'>Configuración</span>
                    <span className='text-[9px] font-medium text-slate-600 truncate'>Ajustes del sitio</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </nav>

        {/* Footer Area */}
        <div className='p-4 mt-auto border-t border-white/5 overflow-hidden'>
          <AnimatePresence>
            {(!isCollapsed || (!isPinned && isHovered)) && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='bg-gradient-to-br from-blue-600/5 to-indigo-600/5 p-4 rounded-2xl border border-blue-600/10 mb-4'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' />
                  <span className='text-[9px] font-black uppercase tracking-widest text-emerald-500'>Engine Active</span>
                </div>
                <div className='flex flex-col gap-1 text-[9px] text-slate-500 uppercase tracking-tighter'>
                  <div className='flex justify-between'><span>Sync:</span> <span className='text-slate-300'>OK</span></div>
                  <div className='flex justify-between'><span>API:</span> <span className='text-slate-300'>Connected</span></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <form action='/api/admin/logout' method='POST'>
            <button className='w-full flex items-center justify-center gap-3 py-4 bg-red-600/5 hover:bg-red-600/10 text-red-500 rounded-2xl text-xs font-black uppercase tracking-[2px] transition-all border border-red-600/10 hover:border-red-600/30 group'>
              <LogOut size={18} className='min-w-[18px] group-hover:translate-x-1 transition-transform' />
              {(!isCollapsed || (!isPinned && isHovered)) && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Cerrar Sesión</motion.span>}
            </button>
          </form>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className='flex-1 relative overflow-auto flex flex-col h-screen'>
        {/* Top Floating Header */}
        <div className='h-20 flex items-center justify-between px-10 backdrop-blur-md sticky top-0 z-30 border-b border-white/5'>
          <div className='flex items-center gap-6'>
             <div className='hidden md:flex flex-col'>
                <span className='text-[10px] font-black text-slate-500 uppercase tracking-[3px] italic'>Panel de Control</span>
                <span className='text-xl font-black text-white uppercase tracking-wider mt-0.5 break-all line-clamp-1'>
                  {pathname === '/admin/partidos' ? 'Gestión de Partidos' : 'Nuevo Evento'}
                </span>
             </div>
          </div>

          <div className='flex items-center gap-6'>
            <div className='hidden lg:flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5'>
              <Activity size={14} className='text-blue-500' />
              <div className='w-px h-3 bg-white/10' />
              <span className='text-[9px] font-black uppercase tracking-widest text-slate-400'>24 Partidos hoy</span>
            </div>
            
            <a href='/' target='_blank' className='flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors bg-white/5 p-2 rounded-lg border border-white/5'>
              <Globe size={16} /> <span className='hidden sm:inline'>Ver Web</span>
            </a>

            <div className='w-px h-6 bg-white/10' />
            
            <div className='flex items-center gap-4'>
              <div className='text-right hidden sm:block'>
                <p className='text-[10px] font-black text-white uppercase tracking-widest leading-none'>Admin Master</p>
                <div className='flex items-center justify-end gap-1.5 mt-1.5'>
                  <div className='w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.8)]' />
                  <p className='text-[8px] font-bold text-slate-500 uppercase tracking-[1px]'>En línea</p>
                </div>
              </div>
              <div className='w-11 h-11 rounded-[14px] bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-400/30 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-blue-900/20 active:scale-95 transition-all cursor-pointer'>
                AD
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className='flex-1 p-8 md:p-12'>
          <AnimatePresence mode='wait'>
            <motion.div 
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
