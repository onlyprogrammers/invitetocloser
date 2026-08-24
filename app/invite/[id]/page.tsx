import { notFound } from 'next/navigation'
import { CalendarDays, Clock3, MapPin } from 'lucide-react'

type Invitation = {
  template_id: string
  host_name: string
  guest_name: string
  occasion: string
  message: string
  event_date: string
  event_time: string
  venue: string
  address: string
}

async function getInvitation(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/invitations?id=eq.${encodeURIComponent(id)}&select=*`, {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '' },
    cache: 'no-store',
  })
  if (!response.ok) return null
  const rows = (await response.json()) as Invitation[]
  return rows[0] ?? null
}

export default async function InvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getInvitation(id)
  if (!data) notFound()
  const rose = data.template_id === 'rose-noor'
  return (
    <main className="shared-invitation-shell">
      <article className={`invite-card ${rose ? 'invite-rose' : 'invite-emerald'}`}>
        <div className="invite-card-inner">
          <p className="invite-kicker">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          <div className="invite-ornament">{rose ? '❀' : '✦'}</div>
          <p className="invite-eyebrow">{rose ? 'Please join us for an evening of' : 'You are warmly invited to our'}</p>
          <h1>{data.occasion}</h1>
          <div className="invite-name">{data.host_name}</div>
          <p className="invite-copy">{data.message}</p>
          <div className="invite-rule" />
          <div className="invite-details">
            <span><CalendarDays />{data.event_date}</span>
            <span><Clock3 />{data.event_time}</span>
            <span><MapPin />{data.venue}<small>{data.address}</small></span>
          </div>
          <p className="invite-closing">{rose ? 'A little celebration, a lifetime of love' : 'With love &amp; duas'}</p>
        </div>
      </article>
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getInvitation(id)
  return { title: data ? `${data.host_name} — ${data.occasion}` : 'Invitation' }
}
