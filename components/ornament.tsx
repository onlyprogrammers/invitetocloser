export function Ornament({ label = '✦' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-4" aria-hidden="true">
      <span className="gold-rule h-px w-16 sm:w-24" />
      <span className="text-lg text-primary">{label}</span>
      <span className="gold-rule h-px w-16 sm:w-24" />
    </div>
  )
}

export function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string
  title: string
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <p className="text-[0.65rem] tracking-[0.4em] text-primary uppercase">
        {eyebrow}
      </p>
      <h2 className="font-script text-4xl leading-tight text-secondary text-balance sm:text-5xl">
        {title}
      </h2>
      <span className="gold-rule h-px w-24" />
    </div>
  )
}
