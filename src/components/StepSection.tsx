import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { useRef, type RefObject } from 'react'
import type { Step } from '../content'
import { CacFix } from './SubAssemblyVisuals'
import { Counter, Kicker, MarginNote, PartBrick, Reveal } from './ui'
import { ActivationBar, BrandRow, DMThread, GrowthBars, PredictionGame, StreamLineup } from './Visuals'

export function StepBadge({ n }: { n: number | string }) {
  return (
    <motion.div
      className="studs-top relative grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-ink font-display text-4xl font-extrabold text-paper lg:h-20 lg:w-20 lg:text-5xl"
      style={{ ['--stud' as string]: '#1b1813' }}
      initial={{ y: -60, opacity: 0, rotate: -8 }}
      whileInView={{ y: 0, opacity: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 600, damping: 16 }}
    >
      {n}
    </motion.div>
  )
}

export function PartsBox({ parts, label = 'Parts for this step' }: { parts: Step['parts']; label?: string }) {
  return (
    <Reveal className="rounded-2xl border-2 border-ink bg-manual p-4 shadow-[4px_4px_0_#1b1813]">
      <Kicker className="mb-3 text-manual-ink">{label}</Kicker>
      <div className="flex flex-wrap gap-x-5 gap-y-3">
        {parts.map((p, i) => (
          <motion.div
            key={p.name}
            className="flex items-center gap-2"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 600, damping: 18, delay: 0.15 + i * 0.07 }}
          >
            <PartBrick color={p.color} />
            <span className="leading-tight">
              <span className="block font-mono text-xs font-bold text-manual-ink">{p.qty}</span>
              <span className="text-sm font-medium">{p.name}</span>
            </span>
          </motion.div>
        ))}
      </div>
    </Reveal>
  )
}

export function StatTiles({ stats }: { stats: NonNullable<Step['stats']> }) {
  return (
    <div className={`grid gap-3 ${stats.length === 3 ? 'grid-cols-3' : stats.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.06}>
          <div className="studs-top h-full rounded-xl border-2 border-ink bg-white px-4 pt-4 pb-3" style={{ ['--stud' as string]: '#1b1813' }}>
            <Counter value={s.value} className="tabular block font-display text-2xl font-extrabold tracking-tight lg:text-3xl" />
            <span className="mt-1 block text-sm leading-snug text-ink-2">{s.label}</span>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

// A huge outlined step number that drifts behind the page as you scroll.
export function GhostNumber({ n, target }: { n: number; target: RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [120, -120])
  return (
    <motion.span
      aria-hidden
      className="outline-num pointer-events-none absolute top-6 -left-3 font-display text-[10rem] leading-none font-extrabold select-none lg:-left-10 lg:text-[16rem]"
      style={{ y }}
    >
      {String(n).padStart(2, '0')}
    </motion.span>
  )
}

const VISUALS = {
  brands: BrandRow,
  growth: GrowthBars,
  dms: DMThread,
  activation: ActivationBar,
  streams: StreamLineup,
}

export function StepSection({ step }: { step: Step }) {
  const local = useRef<HTMLElement | null>(null)
  const Visual = step.visual ? VISUALS[step.visual] : null
  const game = step.subs?.find((s) => s.id === 'game')
  const cac = step.subs?.find((s) => s.id === 'cac')

  return (
    <section ref={local} id={`step-${step.n}`} className="relative py-16 lg:py-24">
      <GhostNumber n={step.n} target={local} />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        {/* the story */}
        <div className="space-y-6">
          <div className="flex items-center gap-5">
            <StepBadge n={step.n} />
            <div>
              <Reveal y={12}>
                <Kicker>
                  {step.kicker} · {step.when}
                </Kicker>
              </Reveal>
              <Reveal y={12} delay={0.05}>
                <h2 className="font-display text-4xl leading-[1.02] font-extrabold tracking-tight lg:text-5xl">{step.title}</h2>
              </Reveal>
            </div>
          </div>
          {step.body.map((p, i) => (
            <div key={i} className="space-y-3">
              <Reveal delay={0.05}>
                <p className="text-[18px] leading-[1.7] lg:text-[19px]">{p.text}</p>
              </Reveal>
              {p.note && <MarginNote point="up" className="pl-2">{p.note}</MarginNote>}
            </div>
          ))}
          <PartsBox parts={step.parts} />
        </div>

        {/* the work */}
        <div className="space-y-5 lg:pt-4">
          {game && <PredictionGame sub={game} />}
          {cac && (
            <Reveal>
              <div className="rounded-2xl border-2 border-ink bg-manual p-5 shadow-[5px_5px_0_#1b1813]">
                <Kicker className="text-manual-ink">Sub-assembly</Kicker>
                <p className="mt-1 font-display text-2xl font-bold">{cac.title}</p>
                {cac.body.map((p) => (
                  <p key={p.text} className="mt-2 text-[16px] leading-relaxed">
                    {p.text}
                  </p>
                ))}
                <div className="mt-4">
                  <CacFixInView />
                </div>
              </div>
            </Reveal>
          )}
          {Visual && <Visual />}
          {step.stats && !game && <StatTiles stats={step.stats} />}
        </div>
      </div>
    </section>
  )
}

// The CAC chart animates when it scrolls into view rather than on mount.
function CacFixInView() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  return <div ref={ref}>{inView ? <CacFix /> : <div className="h-[260px]" />}</div>
}
