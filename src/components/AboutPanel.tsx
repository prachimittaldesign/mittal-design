const LINKS = [
  { label: 'hello@', href: 'mailto:hello@prachimittal.com', solid: true },
  { label: 'Resume', href: '#', solid: false },
  { label: 'LinkedIn', href: '#', solid: false },
  { label: 'Dribbble', href: '#', solid: false },
]

export function AboutPanel() {
  return (
    <div className="absolute bottom-[84px] left-4 z-[15] w-[260px] rounded-[14px] border border-black/[0.07] bg-white/70 p-[16px_18px] text-[12px] text-ink backdrop-blur-[12px]">
      <h4 className="mb-[7px] font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">
        About
      </h4>
      <p className="mb-3 leading-[1.55]">
        Prachi designs digital products and physical spaces. Twelve shipped surfaces below —
        mapped by audience and complexity. The cottage in the far corner is her architecture
        practice.
      </p>
      <div className="flex flex-wrap gap-[5px]">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={[
              'inline-block rounded-full px-[10px] py-[5px] text-[11px] font-semibold tracking-[0.04em]',
              'transition-transform duration-[180ms] hover:-translate-y-0.5',
              link.solid
                ? 'bg-ink text-paper'
                : 'border border-black/20 bg-transparent text-ink',
            ].join(' ')}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}
