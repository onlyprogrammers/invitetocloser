import { notFound } from 'next/navigation'
import { InvitationProvider } from '@/lib/invitation-context'
import { invitation } from '@/lib/invitation-data'
import { HeroInvite } from '@/components/hero-invite'
import { VerseSection } from '@/components/verse-section'
import { DateSection } from '@/components/date-section'
import { VenueSection } from '@/components/venue-section'
import { DuaSection } from '@/components/dua-section'
import { ContactSection } from '@/components/contact-section'
import { ClosingSection } from '@/components/closing-section'

type Row = {
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
  const rows = (await response.json()) as Row[]
  return rows[0] ?? null
}

function toTemplateData(row: Row) {
  const parsed = new Date(`${row.event_date}T${row.event_time}`)
  const validDate = !Number.isNaN(parsed.getTime())
  const date = validDate ? parsed : new Date()
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' })
  const month = date.toLocaleDateString('en-US', { month: 'long' })
  const day = date.toLocaleDateString('en-US', { day: '2-digit' })
  const year = date.toLocaleDateString('en-US', { year: 'numeric' })
  return {
    ...invitation,
    groom: row.host_name,
    bride: row.guest_name,
    occasion: row.occasion,
    hosts: row.message || row.host_name,
    date: { weekday, day, month, year, full: `${weekday}, ${day} ${month} ${year}` },
    time: { label: row.event_time, note: 'Please join us for this special celebration' },
    startsAt: `${row.event_date}T${row.event_time}`,
    venue: { ...invitation.venue, name: row.venue, address: row.address },
  }
}

export default async function InvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const row = await getInvitation((await params).id)
  if (!row) notFound()
  const data = toTemplateData(row)
  return (
    <InvitationProvider value={data}>
      <div className="invitation-page">
        <main className="relative z-10 mx-auto w-full max-w-2xl">
          <HeroInvite />
          <VerseSection />
          <DateSection />
          <VenueSection />
          <DuaSection />
          <ContactSection />
          <ClosingSection />
        </main>
      </div>
    </InvitationProvider>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const row = await getInvitation((await params).id)
  return { title: row ? `${row.host_name} — ${row.occasion}` : 'Invitation' }
}
