import { animate, motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { COLORS } from '../brick/engine'

export const SNAP = { type: 'spring', stiffness: 520, damping: 24, mass: 0.8 } as const

// Fades and lifts content in as it enters the viewport.
export function Reveal({ children, delay = 0, className, y = 24 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ ...SNAP, delay }}
    >
      {children}
    </motion.div>
  )
}

// Letters drop in one by one and land like bricks.
export function DropText({ text, className, delay = 0, stagger = 0.035 }: { text: string; className?: string; delay?: number; stagger?: number }) {
  const words = text.split(' ')
  let i = 0
  return (
    <span className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
          {[...w].map((ch, ci) => {
            const k = i++
            return (
              <motion.span
                key={ci}
                className="inline-block"
                initial={{ y: '-0.9em', opacity: 0, rotate: k % 2 ? 6 : -6 }}
                whileInView={{ y: 0, opacity: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 700, damping: 18, mass: 0.6, delay: delay + k * stagger }}
              >
                {ch}
              </motion.span>
            )
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}

const parseStat = (v: string) => {
  const m = v.match(/^([^\d]*)([\d,.]+)(.*)$/)
  if (!m) return null
  const num = Number(m[2].replace(/,/g, ''))
  const decimals = m[2].includes('.') ? m[2].split('.')[1].length : 0
  return { prefix: m[1], num, suffix: m[3], decimals, commas: m[2].includes(',') }
}

// Counts up to a value like "$661K+" or "1,900+" when it scrolls into view.
export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduced = useReducedMotion()
  const parsed = parseStat(value)
  const [shown, setShown] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : value)

  useEffect(() => {
    if (!parsed || !inView) return
    if (reduced) return setShown(value)
    const fmt = (n: number) => {
      const s = n.toFixed(parsed.decimals)
      return parsed.commas ? Number(s).toLocaleString('en-US', { minimumFractionDigits: parsed.decimals }) : s
    }
    const c = animate(0, parsed.num, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => setShown(`${parsed.prefix}${fmt(n)}${parsed.suffix}`),
    })
    return () => c.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  )
}

// A lowercase handwritten aside with a little arrow that draws itself.
// `point` says where the thing it talks about is: the text above it, or something below it.
const ARROWS = {
  up: 'M31 23 C 22 22, 10 18, 6 6 M6 6 L3 13 M6 6 L12 10',
  down: 'M31 3 C 22 4, 10 8, 6 20 M6 20 L3 13 M6 20 L12 16',
}
export function MarginNote({ children, className = '', point = 'down' }: { children: ReactNode; className?: string; point?: 'up' | 'down' }) {
  return (
    <motion.div
      className={`flex items-start gap-2 ${className}`}
      initial={{ opacity: 0, rotate: -3, x: -8 }}
      whileInView={{ opacity: 1, rotate: -1.5, x: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ ...SNAP, delay: 0.25 }}
    >
      <svg width="34" height="26" viewBox="0 0 34 26" className={`shrink-0 text-brick ${point === 'up' ? '-mt-1' : 'mt-1'}`} aria-hidden>
        <motion.path
          d={ARROWS[point]}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
        />
      </svg>
      <p className="hand">{children}</p>
    </motion.div>
  )
}

// A tiny isometric 1x2 brick, used for part callouts.
export function PartBrick({ color, size = 34, studs = 2 }: { color: string; size?: number; studs?: 1 | 2 }) {
  const c = COLORS[color] ?? COLORS.red
  const w = studs * 12
  return (
    <svg width={size} height={size * 0.8} viewBox={`-2 -14 ${w + 12} 34`} aria-hidden>
      <polygon points={`0,0 ${w},0 ${w},14 0,14`} fill={c.front} stroke="#2b241c" strokeWidth="0.8" strokeLinejoin="round" />
      <polygon points={`0,0 ${w},0 ${w + 8},-6 8,-6`} fill={c.top} stroke="#2b241c" strokeWidth="0.8" strokeLinejoin="round" />
      <polygon points={`${w},0 ${w + 8},-6 ${w + 8},8 ${w},14`} fill={c.side} stroke="#2b241c" strokeWidth="0.8" strokeLinejoin="round" />
      {Array.from({ length: studs }).map((_, i) => (
        <g key={i} transform={`translate(${6 + i * 12 + 4},-3)`}>
          <path d="M-3.6,-2.6 L-3.6,0 A3.6 1.6 0 0 0 3.6,0 L3.6,-2.6 Z" fill={c.side} stroke="#2b241c" strokeWidth="0.6" />
          <ellipse cx="0" cy="-2.6" rx="3.6" ry="1.6" fill={c.top} stroke="#2b241c" strokeWidth="0.6" />
        </g>
      ))}
    </svg>
  )
}

export function Kicker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`font-mono text-[11px] font-bold tracking-[0.18em] text-ink-3 uppercase ${className}`}>{children}</p>
}
