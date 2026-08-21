import { Reveal } from '@/components/reveal'

export function VerseSection() {
  return (
    <section className="px-6 py-14">
      <Reveal className="mx-auto max-w-md">
        <div className="flex flex-col items-center gap-4 border-y-2 border-primary/40 px-2 py-8 text-center">
          <p className="font-arabic text-xl leading-[2.2] text-secondary">
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
            لِّتَسْكُنُوا إِلَيْهَا
          </p>
          <span className="gold-rule h-px w-20" />
          <p className="text-pretty text-base leading-relaxed text-muted-foreground italic">
            &ldquo;And among His signs is this: He created for you mates from among yourselves, that you may live in peace with them, and He has put love and mercy between your hearts.&rdquo;
          </p>
          <p className="text-xs tracking-[0.3em] text-primary uppercase">
            Qur&apos;an 30:21
          </p>
        </div>
      </Reveal>
    </section>
  )
}
