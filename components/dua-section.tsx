import { Reveal } from '@/components/reveal'

export function DuaSection() {
  return (
    <section className="px-6 py-10">
      <Reveal className="mx-auto max-w-md">
        <div className="relative overflow-hidden rounded-3xl bg-accent px-6 py-10 text-center text-accent-foreground">
          <img
            src="/images/pattern-bg.png"
            alt=""
            className="pointer-events-none absolute inset-0 size-full object-cover opacity-15"
          />
          <div className="relative flex flex-col items-center gap-4">
            <span className="text-2xl text-primary" aria-hidden="true">
              ✦
            </span>
            <p className="font-arabic text-xl leading-[2] text-primary">
              بارك الله لهما وبارك عليهما وجمع بينهما في خير
            </p>
            <span className="gold-rule h-px w-20" />
            <p className="text-pretty text-base leading-relaxed text-accent-foreground/90 italic">
              May Allah bless them, bless upon them, and bring them together in
              goodness.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
