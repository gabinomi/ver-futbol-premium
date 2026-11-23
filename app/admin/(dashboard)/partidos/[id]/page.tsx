import { supabaseAdmin } from '@/lib/supabase'
import { Partido } from '@/types'
import PartidoForm from '@/components/admin/PartidoForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EditarPartidoPage({ params }: { params: { id: string } }) {
  let data = null
  try {
    const res = await supabaseAdmin()
      .from('partidos')
      .select('*')
      .eq('id', params.id)
      .single()
    data = res.data
  } catch (err) {
    console.error('EditarPartidoPage error:', err)
  }

  if (!data) notFound()

  return <PartidoForm modo='editar' partido={data as Partido} />
}
