'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, Clock3, Copy, Eye, LoaderCircle, MapPin, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type InvitationData = {
  couple: string
  occasion: string
  intro: string
  date: string
  time: string
  venue: string
  address: string
  message: string
}

const initialData: InvitationData = {
  couple: 'Aarav & Inaya',
  occasion: 'Walima Ceremony',
  intro: 'With the blessings of Almighty Allah, we invite you to celebrate the beginning of our forever.',
  date: 'Saturday, 18 October 2026',
  time: '6:30 PM onwards',
  venue: 'The Garden Hall',
  address: '42 Jasmine Lane, Lahore',
  message: 'Your presence will make our celebration complete.',
}

const fields: Array<{ key: keyof InvitationData; label: string; placeholder: string; multiline?: boolean }> = [
  { key: 'couple', label: 'Names', placeholder: 'Aarav & Inaya' },
  { key: 'occasion', label: 'Occasion', placeholder: 'Walima Ceremony' },
  { key: 'intro', label: 'Welcome note', placeholder: 'A short invitation message', multiline: true },
  { key: 'date', label: 'Date', placeholder: 'Saturday, 18 October 2026' },
  { key: 'time', label: 'Time', placeholder: '6:30 PM onwards' },
  { key: 'venue', label: 'Venue', placeholder: 'The Garden Hall' },
  { key: 'address', label: 'Address', placeholder: '42 Jasmine Lane, Lahore' },
  { key: 'message', label: 'Closing message', placeholder: 'Your presence will make our celebration complete.', multiline: true },
]

function Field({ field, value, onChange }: { field: (typeof fields)[number]; value: string; onChange: (value: string) => void }) {
  const id = `field-${field.key}`
  return (
    <label htmlFor={id} className="studio-field">
      <span>{field.label}</span>
      {field.multiline ? (
        <textarea id={id} value={value} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} rows={3} />
      ) : (
        <input id={id} value={value} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  )
}

function EmeraldTemplate({ data }: { data: InvitationData }) {
  return (
    <article className="invite-card invite-emerald">
      <div className="invite-card-inner">
        <p className="invite-kicker">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
        <div className="invite-ornament">✦</div>
        <p className="invite-eyebrow">You are warmly invited to our</p>
        <h2>{data.occasion}</h2>
        <div className="invite-name">{data.couple}</div>
        <p className="invite-copy">{data.intro}</p>
        <div className="invite-rule" />
        <div className="invite-details">
          <span><CalendarDays />{data.date}</span>
          <span><Clock3 />{data.time}</span>
          <span><MapPin />{data.venue}<small>{data.address}</small></span>
        </div>
        <p className="invite-closing">{data.message}</p>
        <div className="invite-signoff">With love &amp; duas</div>
      </div>
    </article>
  )
}

function RoseTemplate({ data }: { data: InvitationData }) {
  return (
    <article className="invite-card invite-rose">
      <div className="rose-flower rose-flower-one" aria-hidden="true">❀</div>
      <div className="rose-flower rose-flower-two" aria-hidden="true">✿</div>
      <div className="invite-card-inner">
        <p className="invite-kicker">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
        <div className="rose-line"><span>with joy in our hearts</span></div>
        <p className="invite-eyebrow">Please join us for an evening of</p>
        <h2>{data.occasion}</h2>
        <div className="invite-name">{data.couple}</div>
        <p className="invite-copy">{data.intro}</p>
        <div className="rose-details">
          <div><CalendarDays /><strong>{data.date}</strong></div>
          <div><Clock3 /><strong>{data.time}</strong></div>
          <div><MapPin /><strong>{data.venue}</strong><small>{data.address}</small></div>
        </div>
        <p className="invite-closing">{data.message}</p>
        <div className="invite-signoff">A little celebration, a lifetime of love</div>
      </div>
    </article>
  )
}

export function InvitationStudio() {
  const router = useRouter()
  const [data, setData] = useState(initialData)
  const [template, setTemplate] = useState<'emerald' | 'rose'>('emerald')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const preview = useMemo(() => template === 'emerald' ? <EmeraldTemplate data={data} /> : <RoseTemplate data={data} />, [data, template])

  async function saveInvitation() {
    setSaving(true)
    setSaveError('')
    const supabase = createClient()
    const { data: saved, error } = await supabase.from('invitations').insert({
      template_id: template === 'emerald' ? 'emerald-walima' : 'rose-noor',
      host_name: data.couple,
      guest_name: data.couple,
      occasion: data.occasion,
      message: data.message,
      event_date: data.date,
      event_time: data.time,
      venue: data.venue,
      address: data.address,
    }).select('id').single()
    if (error || !saved) {
      setSaveError('We could not save this invitation. Please try again.')
      setSaving(false)
      return
    }
    router.push(`/invite/${saved.id}?template=${template}`)
  }

  return (
    <main className="studio-shell">
      <section className="studio-intro">
        <div><p className="studio-label"><Sparkles /> Invitation studio</p><h1>Make it yours.<br /><em>Make it unforgettable.</em></h1><p className="studio-subtitle">Shape every detail of your invitation, then choose a beautiful template to bring your celebration to life.</p></div>
        <button className="preview-button" type="button" onClick={() => document.getElementById('live-preview')?.scrollIntoView({ behavior: 'smooth' })}><Eye /> Live preview</button>
      </section>
      <div className="studio-layout">
        <section className="editor-panel" aria-labelledby="editor-title">
          <div className="panel-heading"><div><p className="panel-overline">Your celebration</p><h2 id="editor-title">Invitation details</h2></div><span className="step-pill">Live</span></div>
          <div className="field-grid">{fields.map((field) => <Field key={field.key} field={field} value={data[field.key]} onChange={(value) => setData((current) => ({ ...current, [field.key]: value }))} />)}</div>
          <div className="template-picker"><div className="panel-heading compact"><div><p className="panel-overline">Choose a look</p><h2>Templates</h2></div><span className="template-count">2 available</span></div><div className="template-options">
            <button className={`template-option emerald-thumb ${template === 'emerald' ? 'selected' : ''}`} type="button" onClick={() => setTemplate('emerald')}><span>A</span><strong>Emerald Walima</strong><small>Classic &amp; serene</small></button>
            <button className={`template-option rose-thumb ${template === 'rose' ? 'selected' : ''}`} type="button" onClick={() => setTemplate('rose')}><span>R</span><strong>Rose Noor</strong><small>Soft &amp; romantic</small></button>
          </div></div>
          <button className="publish-button" type="button" onClick={saveInvitation} disabled={saving}>
            {saving ? <LoaderCircle className="spin" /> : <Sparkles />}
            {saving ? 'Saving invitation…' : 'Save & open invitation'}
          </button>
          {saveError && <p className="save-error" role="alert">{saveError}</p>}
        </section>
        <section className="preview-panel" id="live-preview" aria-label="Live invitation preview"><div className="preview-topline"><span><span className="status-dot" /> Preview</span><button type="button" title="Copy invitation link" aria-label="Copy invitation link" onClick={() => navigator.clipboard?.writeText(window.location.href)}><Copy /></button></div>{preview}</section>
      </div>
    </main>
  )
}
