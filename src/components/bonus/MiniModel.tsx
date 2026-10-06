import { animate, useInView, useMotionValue, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { BrickModel } from '../../brick/BrickModel'
import { bounds, project, type Brick } from '../../brick/engine'

export type Box = ReturnType<typeof bounds>

// Percent position of a model-space point inside the model's box, for laying HTML over a model.
export const at = (box: Box, x: number, y: number, z: number) => {
  const [px, py] = project(x, y, z)
  return { left: ((px - box.x) / box.w) * 100, top: ((py - box.y) / box.h) * 100 }
}

export const rectStyle = (box: Box, x0: number, z0: number, x1: number, z1: number, y = 0) => {
  const a = at(box, x0, y, z1)
  const b = at(box, x1, y, z0)
  return { left: `${a.left}%`, top: `${a.top}%`, width: `${b.left - a.left}%`, height: `${b.top - a.top}%` }
}

type Props = {
  bricks: Brick[]
  duration?: number
  className?: string
  children?: (box: Box) => ReactNode
  svgChildren?: ReactNode
  onBuilt?: () => void
  play?: boolean // start building now, instead of waiting to scroll into view
}

// A small model that snaps itself together the first time it scrolls into view.
export function MiniModel({ bricks, duration = 1.6, className = '', children, svgChildren, onBuilt, play }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const inView = play ?? seen
  const reduced = useReducedMotion() ?? false
  const count = useMotionValue(0)
  const box = useMemo(() => bounds(bricks, 10), [bricks])

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      count.set(bricks.length)
      onBuilt?.()
      return
    }
    const c = animate(count, bricks.length, { duration, ease: 'linear', onComplete: onBuilt })
    return () => c.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return (
    <div ref={ref} className={`relative ${className}`} style={{ aspectRatio: `${box.w} / ${box.h}` }}>
      <BrickModel bricks={bricks} count={count} pad={10} reduced={reduced} className="absolute inset-0 h-full w-full overflow-visible">
        {svgChildren}
      </BrickModel>
      {children?.(box)}
    </div>
  )
}
