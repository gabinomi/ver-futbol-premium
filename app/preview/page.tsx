'use client'
import PartidoClient from '@/components/public/PartidoClient'
import { Partido } from '@/types'

export default function PreviewPage() {
  const mockPartido: Partido = {
    id: 1,
    slug: 'long-name-preview',
    equipo_local: 'Independiente Rivadavia de Mendoza',
    equipo_visitante: 'Atlético de Rafaela y Asociados',
    gol_local: 2,
    gol_visitante: 1,
    estado: 'EN-VIVO',
    canales: 'ESPN Premium • Star+ • Fox Sports 1 • Directv Sports • TyC Sports Play • TNT Sports HD',
    hora_utc: new Date().toISOString(),
    img_video: 'https://placehold.co/720x405/060d1a/1746b8?text=EN+VIVO',
    categoria: 'argentina',
    created_at: '',
    updated_at: '',
    link1: 'https://example.com/1',
    link2: 'https://example.com/2',
    link3: 'https://example.com/3'
  }

  const links = {
    video: 'https://example.com/v',
    link1: 'https://example.com/1',
    link2: 'https://example.com/2',
    link3: 'https://example.com/3'
  }

  const horarios: [string, string][] = [
    ['MÉXICO', '14:00'],
    ['COLOMBIA', '15:00'],
    ['ARGENTINA', '17:00'],
    ['ESPAÑA', '21:00']
  ]

  return (
    <div className='bg-[#060d1a] min-h-screen flex flex-col items-center py-10 overflow-x-hidden'>
      <div className='bg-stadium' />
      <div className='w-full max-w-[540px]'>
        <PartidoClient 
          partido={mockPartido}
          escudoLocal={null}
          escudoVisitante={null}
          horarios={horarios}
          links={links}
        />
      </div>
    </div>
  )
}
