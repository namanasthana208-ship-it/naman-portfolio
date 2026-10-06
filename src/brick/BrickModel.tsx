import { animate, motion, motionValue, useMotionValueEvent, type MotionValue } from 'motion/react'
import { memo, useId, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
import { bounds, COLORS, H, prepare, type Brick, type RenderBrick } from './engine'

const STROKE = '#2b1d12'
const DROP = 2.6 * H

type Props = {
  bricks: Brick[]
  count: MotionValue<number> // how many bricks are placed, in build order
  className?: string
  children?: ReactNode // extra SVG drawn above the model, in model coordinates
  pad?: number
  reduced?: boolean
}

// Build order: stage by stage, bottom up, back to front, left to right.
const buildOrder = (bricks: Brick[]) => [...bricks].sort((a, b) => a.step - b.step || a.z - b.z || b.y - a.y || a.x - b.x)

export function BrickModel({ bricks, count, className, children, pad = 16, reduced }: Props) {
  const uid = useId().replace(/:/g, '')
  const prepared = useMemo(() => prepare(bricks), [bricks])
  const box = useMemo(() => bounds(bricks, pad), [bricks, pad])
  const gradients = useMemo(() => {
    const set = new Set<string>()
    for (const b of prepared) for (const f of b.faces) if (f.fill.startsWith('grad:')) set.add(f.fill.slice(5))
    return [...set]
  }, [prepared])

  const values = useMemo(
    () =>
      prepared.map(() => ({
        y: motionValue(-DROP),
        opacity: motionValue(0),
        flash: motionValue(0),
        placed: false,
      })),
    [prepared],
  )
  const byRank = useMemo(() => {
    const index = new Map<number, number>()
    prepared.forEach((b, i) => index.set(b.id, i))
    return buildOrder(bricks).map((b) => index.get(b.id)!)
  }, [prepared, bricks])

  const prev = useRef(0)

  const sync = (target: number, instant = false) => {
    const from = prev.current
    const lo = Math.max(0, Math.min(from, target))
    const hi = Math.min(byRank.length, Math.max(from, target))
    const n = hi - lo
    for (let r = lo; r < hi; r++) {
      const v = values[byRank[r]]
      const place = r < target
      if (v.placed === place) continue
      v.placed = place
      if (instant || reduced) {
        v.y.jump(place ? 0 : -DROP)
        v.opacity.jump(place ? 1 : 0)
        continue
      }
      // spread big jumps out a little so a fast scroll still reads as building
      const k = place ? r - lo : hi - 1 - r
      const delay = n > 6 ? Math.min(k * (0.9 / n), 0.9) : 0
      if (place) {
        v.y.jump(-DROP)
        animate(v.y, 0, { type: 'spring', stiffness: 620, damping: 22, mass: 0.7, delay })
        animate(v.opacity, 1, { duration: 0.12, delay })
        animate(v.flash, [0, 0.75, 0], { duration: 0.5, delay: delay + 0.12, times: [0, 0.15, 1] })
      } else {
        animate(v.y, -DROP * 0.7, { duration: 0.22, ease: [0.4, 0, 1, 1], delay: delay * 0.5 })
        animate(v.opacity, 0, { duration: 0.2, delay: delay * 0.5 })
      }
    }
    prev.current = target
  }

  useLayoutEffect(() => {
    prev.current = 0
    values.forEach((v) => (v.placed = false))
    sync(Math.round(count.get()), true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  useMotionValueEvent(count, 'change', (c) => sync(Math.round(c)))

  return (
    <svg className={className} viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} role="img" aria-label="Brick model">
      <defs>
        {gradients.map((g) => {
          const c = COLORS[g] ?? COLORS.sand
          return (
            <linearGradient key={g} id={`${uid}-${g}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={c.side} />
              <stop offset="22%" stopColor={c.front} />
              <stop offset="42%" stopColor={c.top} />
              <stop offset="70%" stopColor={c.front} />
              <stop offset="100%" stopColor={c.side} />
            </linearGradient>
          )
        })}
      </defs>
      {prepared.map((b, i) => (
        <BrickShape key={b.id} brick={b} v={values[i]} uid={uid} />
      ))}
      {children}
    </svg>
  )
}

type V = { y: MotionValue<number>; opacity: MotionValue<number>; flash: MotionValue<number> }

const BrickShape = memo(function BrickShape({ brick, v, uid }: { brick: RenderBrick; v: V; uid: string }) {
  const front = brick.faces.find((f) => f.kind === 'front')
  const op = brick.transparent ? 0.25 : 0.5
  return (
    <motion.g style={{ y: v.y, opacity: v.opacity }}>
      {brick.faces.map((f, i) => {
        const fill = f.fill.startsWith('grad:') ? `url(#${uid}-${f.fill.slice(5)})` : f.fill
        return f.d ? (
          <path key={i} d={f.d} fill={fill} stroke={STROKE} strokeOpacity={op} strokeWidth={0.6} strokeLinejoin="round" />
        ) : (
          <polygon key={i} points={f.points} fill={fill} stroke={STROKE} strokeOpacity={op} strokeWidth={0.6} strokeLinejoin="round" />
        )
      })}
      {brick.studs.map((s, i) => {
        const r = s.r ?? 3.6
        const ry = r * 0.47
        return (
          <g key={`s${i}`}>
            <path
              d={`M${s.cx - r},${s.cy - 2.6} L${s.cx - r},${s.cy} A${r} ${ry} 0 0 0 ${s.cx + r},${s.cy} L${s.cx + r},${s.cy - 2.6} Z`}
              fill={s.color.side}
              stroke={STROKE}
              strokeOpacity={0.4}
              strokeWidth={0.5}
            />
            <ellipse cx={s.cx} cy={s.cy - 2.6} rx={r} ry={ry} fill={s.color.top} stroke={STROKE} strokeOpacity={0.4} strokeWidth={0.5} />
          </g>
        )
      })}
      {front &&
        (front.d ? (
          <motion.path d={front.d} fill="#fff" style={{ opacity: v.flash }} pointerEvents="none" />
        ) : (
          <motion.polygon points={front.points} fill="#fff" style={{ opacity: v.flash }} pointerEvents="none" />
        ))}
    </motion.g>
  )
})
