import { SectionTitle } from '@/components/ornament'
import { Reveal } from '@/components/reveal'
import { ScratchDate } from '@/components/scratch-date'

export function DateSection() {
  return (
    <section className="px-6 py-14">
      <div className="mx-auto flex max-w-md flex-col items-center gap-8">
        <Reveal className="w-full">
          <SectionTitle eyebrow="Save the Moment" title="Date &amp; Timing" />
        </Reveal>
        <Reveal delay={140} className="w-full">
          <ScratchDate />
        </Reveal>
      </div>
    </section>
  )
}
