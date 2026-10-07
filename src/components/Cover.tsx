import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { INTRO, PROFILE } from '../content'
import { DropText, Kicker, Reveal } from './ui'

export function ContactButtons({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  const items = [
    { label: 'CV', href: PROFILE.cv, bg: '#d7372a', fg: '#fff', top: '#f0584a', download: true },
    { label: 'Email', href: `mailto:${PROFILE.email}`, bg: '#f5c21b', fg: '#1b1813', top: '#ffd84a' },
    { label: 'LinkedIn', href: PROFILE.linkedin, bg: '#2c7cc6', fg: '#fff', top: '#4e9be0' },
    { label: 'X', href: PROFILE.x, bg: '#f1f1ee', fg: '#1b1813', top: '#ffffff' },
  ]
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {items.map((it, i) => (
        <motion.a
          key={it.label}
          href={it.href}
          target={it.href.startsWith('http') ? '_blank' : undefined}
          rel="noreferrer"
          download={it.download ? 'Naman_Asthana_CV.pdf' : undefined}
          className="brick-btn studs-top"
          style={{ ['--btn-bg' as string]: it.bg, ['--btn-fg' as string]: it.fg, ['--btn-top' as string]: it.top }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 600, damping: 16, delay: delay + i * 0.09 }}
        >
          {it.label}
        </motion.a>
      ))}
    </div>
  )
}

// The little red brick that hops in like the Pixar lamp and lands as the full stop.
const HOP = {
  x: [520, 410, 300, 300, 200, 100, 100, 40, 0, 0],
  y: [0, -120, 0, 0, -85, 0, 0, -48, 0, 0],
  scaleY: [1, 1.18, 0.62, 1, 1.14, 0.7, 1, 1.08, 0.58, 1],
  scaleX: [1, 0.88, 1.3, 1, 0.9, 1.25, 1, 0.94, 1.4, 1],
  times: [0, 0.11, 0.22, 0.27, 0.4, 0.53, 0.58, 0.7, 0.84, 1],
}
const HOP_DELAY = 1.15
const HOP_TIME = 1.35
const LANDED = HOP_DELAY + HOP_TIME * 0.84

function HopBrick() {
  return (
    <span className="relative ml-[0.04em] inline-block h-[0.3em] w-[0.42em] align-baseline">
      <motion.span
        className="absolute bottom-0 left-0 block h-full w-full origin-bottom"
        initial={{ x: HOP.x[0], opacity: 0 }}
        animate={{ x: HOP.x, y: HOP.y, scaleX: HOP.scaleX, scaleY: HOP.scaleY, opacity: 1 }}
        transition={{
          duration: HOP_TIME,
          delay: HOP_DELAY,
          times: HOP.times,
          ease: ['easeOut', 'easeIn', 'linear', 'easeOut', 'easeIn', 'linear', 'easeOut', 'easeIn', 'easeOut'],
          opacity: { duration: 0.1, delay: HOP_DELAY },
        }}
      >
        <svg viewBox="-1 -9 34 22" className="h-full w-full overflow-visible" aria-hidden>
          <rect x="0" y="0" width="26" height="12" rx="1.5" fill="#d7372a" stroke="#1b1813" strokeWidth="1.4" />
          <path d="M0 0 L6 -5 L32 -5 L26 0 Z" fill="#f0584a" stroke="#1b1813" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M26 0 L32 -5 L32 7 L26 12 Z" fill="#a6261c" stroke="#1b1813" strokeWidth="1.4" strokeLinejoin="round" />
          {[8, 19].map((cx) => (
            <g key={cx}>
              <rect x={cx - 3.5} y="-7.5" width="7" height="3" fill="#a6261c" />
              <ellipse cx={cx} cy="-7.5" rx="3.5" ry="1.4" fill="#f0584a" stroke="#1b1813" strokeWidth="1" />
            </g>
          ))}
        </svg>
      </motion.span>
      {/* dust from the final landing */}
      {[-1, 1].map((d) => (
        <motion.span
          key={d}
          className="absolute bottom-0 left-1/2 block h-[0.12em] w-[0.12em] rounded-full bg-ink/25"
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], x: d * 26, y: -10, scale: [0.6, 1.4, 0.4] }}
          transition={{ duration: 0.5, delay: LANDED }}
        />
      ))}
    </span>
  )
}

const LINES = ['I make iced pour-overs.', 'I read too many comics.', 'I practically live at the movie theatre.', 'I do growth marketing.']

function RotatingLine({ start }: { start: number }) {
  const [i, setI] = useState(-1)
  useEffect(() => {
    const timers = LINES.map((_, k) => setTimeout(() => setI(k), (start + k * 0.85) * 1000))
    return () => timers.forEach(clearTimeout)
  }, [start])
  return (
    <span className="relative grid overflow-hidden">
      {/* every line, invisible and stacked, so the box is as tall as the longest one once it wraps */}
      {LINES.map((l) => (
        <span key={l} className="invisible col-start-1 row-start-1" aria-hidden>
          {l}
        </span>
      ))}
      <AnimatePresence mode="popLayout" initial={false}>
        {i >= 0 && (
          <motion.span
            key={i}
            className={`absolute inset-x-0 top-0 block ${i === LINES.length - 1 ? 'text-ink' : 'text-ink-3'}`}
            initial={{ y: '100%', opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: '-100%', opacity: 0, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          >
            {LINES[i]}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

// The four numbers I'd want someone to remember, as studded bricks that drop in after the hop.
const HIGHLIGHTS = [
  { value: '$661K+', label: 'trading volume from the affiliate channel', bg: '#d7372a', fg: '#fff', top: '#f0584a', tilt: -2 },
  { value: '74%', label: 'lower cost per signup on paid ads', bg: '#f5c21b', fg: '#1b1813', top: '#ffd84a', tilt: 1.5 },
  { value: '20→35%', label: 'monthly activation rate', bg: '#2c7cc6', fg: '#fff', top: '#4e9be0', tilt: 1 },
  { value: '100M+', label: 'accounts reached with content', bg: '#3fa04b', fg: '#fff', top: '#5fbf6a', tilt: -1.5 },
]

function HighlightTiles({ delay }: { delay: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:gap-5">
      {HIGHLIGHTS.map((h, i) => (
        <motion.div
          key={h.value}
          className="studs-top relative flex aspect-[5/4] flex-col justify-between rounded-xl border-2 border-ink p-4 shadow-[5px_5px_0_#1b1813] lg:p-5"
          style={{ background: h.bg, color: h.fg, ['--stud' as string]: h.top }}
          initial={{ y: -90, opacity: 0, rotate: h.tilt * 4 }}
          animate={{ y: 0, opacity: 1, rotate: h.tilt }}
          whileHover={{ y: -6, rotate: 0, transition: { type: 'spring', stiffness: 400, damping: 18 } }}
          transition={{ type: 'spring', stiffness: 520, damping: 15, delay: delay + i * 0.12 }}
        >
          <span className="tabular font-display text-[clamp(1.7rem,3.2vw,2.6rem)] leading-none font-extrabold tracking-tight">{h.value}</span>
          <span className="text-[13px] leading-snug font-medium opacity-90 lg:text-sm">{h.label}</span>
        </motion.div>
      ))}
    </div>
  )
}

function Hero() {
  const lineStart = LANDED + 0.35
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Kicker>Lucknow · open to moving</Kicker>
        </motion.div>
        <h1 className="mt-4 font-display text-[clamp(3.4rem,10vw,8.5rem)] leading-[0.9] font-extrabold tracking-[-0.035em]">
          <DropText text="Hey, I'm" delay={0.2} />
          <br />
          <motion.span
            className="inline-block origin-bottom"
            animate={{ scaleY: [1, 1, 0.9, 1.03, 1], scaleX: [1, 1, 1.04, 0.99, 1] }}
            transition={{ duration: 0.45, delay: LANDED - 0.05, times: [0, 0.01, 0.3, 0.7, 1] }}
          >
            <DropText text="Naman" delay={0.55} stagger={0.06} />
          </motion.span>
          <HopBrick />
        </h1>
        <div className="mt-5 font-display text-[clamp(1.4rem,3vw,2.3rem)] font-semibold">
          <RotatingLine start={lineStart} />
        </div>
        <ContactButtons className="mt-8" delay={LANDED + 0.2} />
      </div>

      <HighlightTiles delay={LANDED + 0.15} />
    </div>
  )
}

export function Cover() {
  const [run, setRun] = useState(0)
  return (
    <>
      <section id="top" className="relative flex min-h-[100svh] flex-col justify-center pt-28 pb-16">
        <Hero key={run} />
        <motion.button
          onClick={() => setRun((r) => r + 1)}
          className="absolute right-0 bottom-6 rounded-full border-2 border-ink/15 px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-[0.16em] text-ink-2 uppercase hover:border-ink hover:text-ink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.5 }}
        >
          ↻ Replay intro
        </motion.button>
      </section>

      <section id="about" className="py-12 lg:py-16">
        <Reveal>
          <div className="rounded-2xl border-2 border-ink bg-white p-6 shadow-[6px_6px_0_#1b1813] lg:p-10">
            <div className="mb-5 flex items-center justify-between gap-3 border-b-2 border-dashed border-ink/20 pb-4">
              <h2 className="font-display text-2xl font-extrabold lg:text-3xl">Before you start</h2>
              <span className="font-mono text-[11px] font-bold tracking-[0.16em] text-ink-3 uppercase">7 steps · 1 parts list</span>
            </div>
            <div className="grid gap-5 text-[18px] leading-[1.7] lg:grid-cols-2 lg:gap-10 lg:text-[19px]">
              {INTRO.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
