import { AnimatePresence, animate, motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { SubAssembly } from '../content'
import { Counter, Kicker } from './ui'

const card = 'rounded-2xl border-2 border-ink bg-white p-5 shadow-[5px_5px_0_#1b1813]'

/* ---------- The Indian Idiot: brands ---------- */
const BRANDS = ['Netflix', 'Prime Video', 'Spotify', 'Flipkart', 'Indeed']
const BRAND_COLORS = ['#d7372a', '#2c7cc6', '#3fa04b', '#f5c21b', '#1b1813']
export function BrandRow() {
  return (
    <div className={card}>
      <Kicker>Brands I wrote for</Kicker>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {BRANDS.map((b, i) => (
          <motion.span
            key={b}
            className="studs-top rounded-md px-3 py-2 text-sm font-bold text-white"
            style={{ background: BRAND_COLORS[i], color: i === 3 ? '#1b1813' : '#fff', ['--stud' as string]: BRAND_COLORS[i] }}
            initial={{ y: -40, opacity: 0, rotate: i % 2 ? 6 : -6 }}
            whileInView={{ y: 0, opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 600, damping: 16, delay: 0.1 + i * 0.08 }}
          >
            {b}
          </motion.span>
        ))}
        <motion.span
          className="rounded-md border-2 border-dashed border-ink/30 px-3 py-2 text-sm font-semibold text-ink-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          and 15+ more
        </motion.span>
      </div>
    </div>
  )
}

/* ---------- DGBet: growth bars ---------- */
function GrowthPair({ label, from, to, fromLabel, toLabel, ratio, color }: { label: string; from: number; to: number; fromLabel: string; toLabel: string; ratio: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  return (
    <div ref={ref}>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-sm font-semibold">{label}</p>
        <motion.span
          className="rounded-full bg-ink px-2 py-0.5 font-mono text-[11px] font-bold text-paper"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 1.2 }}
        >
          {ratio}
        </motion.span>
      </div>
      {[
        { v: from, l: fromLabel, faded: true },
        { v: to, l: toLabel, faded: false },
      ].map((row, i) => (
        <div key={i} className="mb-1.5 flex items-center gap-3">
          <div className="h-7 flex-1 overflow-hidden rounded-md bg-ink/5">
            <motion.div
              className="flex h-full items-center rounded-md px-2"
              style={{ background: row.faded ? `${color}55` : color }}
              initial={{ width: '0%' }}
              animate={inView ? { width: `${Math.max(4, (row.v / to) * 100)}%` } : {}}
              transition={{ type: 'spring', stiffness: 60, damping: 16, delay: 0.2 + i * 0.4 }}
            />
          </div>
          <span className="tabular w-24 shrink-0 text-right text-sm">
            <span className="font-display font-extrabold">{row.l}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

export function GrowthBars() {
  return (
    <div className={`${card} space-y-5`}>
      <Kicker>Monthly impressions</Kicker>
      <GrowthPair label="Instagram meme page · first month vs month four" from={368} to={3700} fromLabel="368K" toLabel="3.7M" ratio="10x" color="#d7372a" />
      <GrowthPair label="Football on X · first month vs month six" from={875} to={6000} fromLabel="875K" toLabel="6M" ratio="~7x" color="#2c7cc6" />
      <GrowthPair label="X followers" from={110} to={5000} fromLabel="110" toLabel="5,000+" ratio="45x" color="#3fa04b" />
    </div>
  )
}

/* ---------- Affiliates: a DM thread ---------- */
const DMS = [
  { me: true, t: 'Hey, saw your football threads. We’re DG3, a sports prediction market terminal. Want a cut of every trader you bring in?' },
  { me: false, t: 'how much are we talking' },
  { me: true, t: 'Depends on volume. I’ll make assets for your audience so it doesn’t read like an ad.' },
  { me: false, t: 'ok send it over' },
]
export function DMThread() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })
  const [shown, setShown] = useState(0)
  const [typing, setTyping] = useState(false)
  const [replies, setReplies] = useState(0)

  useEffect(() => {
    if (!inView) return
    let i = 0
    const timers: ReturnType<typeof setTimeout>[] = []
    const next = () => {
      if (i >= DMS.length) return
      setTyping(true)
      timers.push(
        setTimeout(() => {
          setTyping(false)
          setShown(++i)
          timers.push(setTimeout(next, 350))
        }, 750),
      )
    }
    next()
    const c = animate(0, 1000, { duration: 3.6, ease: [0.3, 0, 0.2, 1], onUpdate: (v) => setReplies(Math.round(v)) })
    return () => {
      timers.forEach(clearTimeout)
      c.stop()
    }
  }, [inView])

  return (
    <div ref={ref} className={card}>
      <div className="mb-4 flex items-center justify-between border-b-2 border-dashed border-ink/15 pb-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink font-display text-xs font-bold text-paper">X</span>
          <div>
            <p className="text-sm font-semibold leading-tight">Cold DM, reply 1 of 1,000+</p>
            <p className="text-[11px] text-ink-3">an illustration, not a real conversation</p>
          </div>
        </div>
        <div className="text-right">
          <p className="tabular font-display text-2xl leading-none font-extrabold">{replies.toLocaleString('en-US')}{replies === 1000 ? '+' : ''}</p>
          <p className="text-[11px] text-ink-3">replies handled</p>
        </div>
      </div>
      <div className="flex min-h-[230px] flex-col gap-2">
        {DMS.slice(0, shown).map((m, i) => (
          <motion.div
            key={i}
            className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-[14px] leading-snug ${m.me ? 'self-end rounded-br-md bg-[#1d9bf0] text-white' : 'self-start rounded-bl-md bg-ink/[0.07]'}`}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 26 }}
            style={{ transformOrigin: m.me ? '100% 100%' : '0% 100%' }}
          >
            {m.t}
          </motion.div>
        ))}
        <AnimatePresence>
          {typing && (
            <motion.div
              className={`flex gap-1 rounded-2xl px-3.5 py-3 ${DMS[shown]?.me ? 'self-end bg-[#1d9bf0]/20' : 'self-start bg-ink/[0.07]'}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {[0, 1, 2].map((d) => (
                <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-ink/40" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.12 }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------- Activation: 20% to 35% ---------- */
export function ActivationBar() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const [v, setV] = useState(20)
  useEffect(() => {
    if (!inView) return
    const c = animate(20, 35, { duration: 1.8, delay: 0.5, ease: [0.2, 0.8, 0.2, 1], onUpdate: (n) => setV(n) })
    return () => c.stop()
  }, [inView])
  return (
    <div ref={ref} className={card}>
      <div className="flex items-end justify-between">
        <Kicker>Monthly activation rate</Kicker>
        <p className="tabular font-display text-5xl leading-none font-extrabold">{Math.round(v)}%</p>
      </div>
      <div className="relative mt-5 h-10 overflow-hidden rounded-lg border-2 border-ink bg-ink/5">
        <div className="absolute inset-y-0 left-0 bg-ink/15" style={{ width: '20%' }} />
        <motion.div className="absolute inset-y-0 left-0 bg-[#3fa04b]" style={{ width: `${v}%` }} />
        <div className="absolute inset-y-0 left-[20%] w-0.5 bg-ink" />
        <div className="absolute inset-y-0 left-[35%] w-0.5 border-l-2 border-dashed border-ink/50" />
      </div>
      <div className="relative mt-2 h-5 text-xs text-ink-2">
        <span className="absolute left-[20%] -translate-x-1/2">before · 20%</span>
        <span className="absolute left-[35%] translate-x-2">after · 35%</span>
      </div>
      <p className="mt-3 text-sm text-ink-2">Email open rates above 25%, peaking at 35%.</p>
    </div>
  )
}

/* ---------- Content: live coverage ---------- */
const STREAMS = [
  { t: 'FIFA World Cup 2026', d: 'Group stage to the final' },
  { t: 'Wimbledon 2026', d: 'Streams and podcasts' },
  { t: 'Premier League', d: 'Live coverage' },
]
export function StreamLineup() {
  return (
    <div className={card}>
      <Kicker>Hosted and produced</Kicker>
      <div className="mt-4 space-y-2.5">
        {STREAMS.map((s, i) => (
          <motion.div
            key={s.t}
            className="flex items-center gap-3 rounded-xl bg-ink px-4 py-3 text-paper"
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 24, delay: i * 0.1 }}
          >
            <motion.span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ff3b30]" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }} />
            <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#ff8a80]">LIVE</span>
            <span className="min-w-0">
              <span className="block font-semibold">{s.t}</span>
              <span className="block text-xs text-paper/60">{s.d}</span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Paid: play the funnel ---------- */
export function PredictionGame({ sub }: { sub: SubAssembly }) {
  const [pick, setPick] = useState<'bar' | 'mun' | null>(null)
  const right = pick === 'bar'
  return (
    <div className={`${card} overflow-hidden`}>
      <Kicker>Quick one</Kicker>
      <p className="mt-2 font-display text-2xl leading-tight font-bold">Rome, 2009. Champions League final. Who wins?</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {(
          [
            ['bar', 'Barcelona', '#a50044'],
            ['mun', 'Man United', '#da291c'],
          ] as const
        ).map(([id, name, c]) => (
          <motion.button
            key={id}
            onClick={() => setPick(id)}
            disabled={pick !== null}
            className="studs-top relative rounded-xl border-2 border-ink px-4 py-4 text-left font-bold text-white disabled:cursor-default"
            style={{ background: c, ['--stud' as string]: c }}
            whileHover={pick ? undefined : { y: -3 }}
            whileTap={pick ? undefined : { y: 2 }}
            animate={pick ? { opacity: pick === id ? 1 : 0.35, scale: pick === id ? 1.02 : 0.98 } : {}}
          >
            {name}
            {pick && id === 'bar' && <span className="mt-1 block font-mono text-xs font-bold text-white/85">WON 2–0</span>}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {pick && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ type: 'spring', stiffness: 160, damping: 24, delay: 0.25 }}
          >
            <div className="mt-5 rounded-xl bg-manual p-4">
              <p className="font-display text-lg font-bold">{right ? 'Nice. ' : 'Barcelona won 2–0. '}That’s how I got 1,900+ signups.</p>
              {sub.body.map((p) => (
                <p key={p.text} className="mt-2 text-[15px] leading-relaxed">
                  {p.text}
                </p>
              ))}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['$9.5K', 'ad spend'],
                  ['7', 'countries'],
                  ['2.1M+', 'impressions'],
                  ['1,900+', 'signups'],
                ].map(([v, l]) => (
                  <div key={l}>
                    <Counter value={v} className="tabular block font-display text-2xl font-extrabold" />
                    <span className="text-xs text-ink-2">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!pick && <p className="mt-3 text-xs text-ink-3">Pick one. There’s a point to this.</p>}
    </div>
  )
}
