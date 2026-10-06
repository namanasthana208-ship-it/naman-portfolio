import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { MarginNote } from '../ui'

const T = 9 // one full brew, in seconds
const loop = { duration: T, repeat: Infinity, ease: 'easeInOut' as const }

// An iced V60: the kettle tilts in and pours in slow circles, coffee drips through onto ice and the glass fills.
function PourOver({ play }: { play: boolean }) {
  const go = play ? 'run' : 'idle'
  return (
    <svg viewBox="0 0 260 310" className="h-full w-full" role="img" aria-label="An iced V60 pour-over being brewed">
      <defs>
        <clipPath id="v60-glass">
          <path d="M72 176 L168 176 L160 292 Q120 298 80 292 Z" />
        </clipPath>
        <linearGradient id="v60-coffee" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#8a4d26" />
          <stop offset="100%" stopColor="#3b1e0d" />
        </linearGradient>
        <linearGradient id="v60-cone" x1="0" x2="1">
          <stop offset="0%" stopColor="#d9d3c8" />
          <stop offset="45%" stopColor="#fbf8f2" />
          <stop offset="100%" stopColor="#cfc8bb" />
        </linearGradient>
        <linearGradient id="v60-kettle" x1="0" x2="1">
          <stop offset="0%" stopColor="#1f1f1f" />
          <stop offset="50%" stopColor="#3a3a3a" />
          <stop offset="100%" stopColor="#161616" />
        </linearGradient>
      </defs>

      {/* glass, coffee and ice */}
      <g clipPath="url(#v60-glass)">
        <motion.rect
          x="60"
          width="120"
          height="140"
          fill="url(#v60-coffee)"
          initial={{ y: 296 }}
          animate={go === 'run' ? { y: [296, 296, 214, 214, 296] } : { y: 230 }}
          transition={go === 'run' ? { ...loop, times: [0, 0.18, 0.86, 0.95, 1] } : { duration: 0 }}
        />
        {[
          { x: 86, y: 232, r: 8 },
          { x: 122, y: 248, r: -10 },
          { x: 104, y: 266, r: 14 },
          { x: 138, y: 222, r: 4 },
        ].map((c, i) => (
          <motion.rect
            key={i}
            x={c.x}
            y={c.y}
            width="26"
            height="24"
            rx="5"
            fill="rgba(225,242,255,0.28)"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.2"
            style={{ rotate: c.r, transformBox: 'fill-box', transformOrigin: 'center' }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2.4 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </g>
      <path d="M72 176 L168 176 L160 292 Q120 298 80 292 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" />
      <path d="M80 186 L86 284" stroke="rgba(255,255,255,0.22)" strokeWidth="3" strokeLinecap="round" />

      {/* drips from the cone */}
      {play &&
        [0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx="120"
            r="2.4"
            fill="#6b3a1c"
            initial={{ cy: 172, opacity: 0 }}
            animate={{ cy: [172, 214], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.55, repeat: Infinity, delay: 1.5 + i * 0.18, ease: 'easeIn', repeatDelay: 0.05 }}
          />
        ))}

      {/* the V60 */}
      <ellipse cx="120" cy="176" rx="34" ry="5" fill="#bdb5a6" />
      <path d="M68 108 L172 108 L128 170 L112 170 Z" fill="url(#v60-cone)" stroke="#8f8676" strokeWidth="1.2" strokeLinejoin="round" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${84 + i * 17} 112 Q${96 + i * 9} 140 ${114 + i * 3} 166`} fill="none" stroke="#b9b0a0" strokeWidth="1" opacity="0.7" />
      ))}
      <path d="M172 116 C196 116 196 150 160 150" fill="none" stroke="url(#v60-cone)" strokeWidth="7" strokeLinecap="round" />
      <path d="M172 116 C196 116 196 150 160 150" fill="none" stroke="#8f8676" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      {/* filter paper and coffee bed */}
      <path d="M70 108 L74 100 L80 106 L86 99 L92 106 L98 99 L104 106 L110 99 L116 106 L122 99 L128 106 L134 99 L140 106 L146 99 L152 106 L158 99 L164 106 L170 100 L172 108 Z" fill="#efe3c9" />
      <ellipse cx="120" cy="110" rx="49" ry="6" fill="#4a2510" />
      <motion.ellipse
        cx="120"
        cy="109"
        rx="30"
        ry="3"
        fill="#7a4421"
        animate={play ? { rx: [20, 34, 22, 30, 20], opacity: [0.5, 1, 0.7, 1, 0.5] } : {}}
        transition={{ ...loop, duration: 3 }}
      />

      {/* kettle: it pivots on the tip of its spout, so the stream always leaves from the spout */}
      <motion.g
        style={{ transformBox: 'view-box', originX: '150px', originY: '62px' }}
        initial={{ rotate: 0 }}
        animate={play ? { rotate: [0, -30, -26, -30, 0, 0] } : { rotate: 0 }}
        transition={play ? { ...loop, times: [0, 0.08, 0.35, 0.62, 0.7, 1] } : { duration: 0 }}
      >
        <path d="M198 96 C178 96 170 80 160 68 C157 64 153 61 149 62" fill="none" stroke="#2a2a2a" strokeWidth="5" strokeLinecap="round" />
        <rect x="194" y="58" width="56" height="46" rx="11" fill="url(#v60-kettle)" />
        <rect x="208" y="50" width="28" height="10" rx="4" fill="#2a2a2a" />
        <circle cx="222" cy="47" r="4" fill="#3a3a3a" />
        <path d="M250 68 C268 70 268 94 250 96" fill="none" stroke="#2a2a2a" strokeWidth="6" strokeLinecap="round" />
        <path d="M200 64 L200 98" stroke="rgba(255,255,255,0.12)" strokeWidth="3" strokeLinecap="round" />
      </motion.g>

      {/* the pour: a thin stream from the spout that circles over the bed */}
      {play && (
        <motion.path
          fill="none"
          stroke="rgba(205,232,255,0.9)"
          strokeWidth="2.4"
          strokeLinecap="round"
          animate={{
            d: ['M150 62 Q140 88 120 108', 'M150 62 Q147 90 134 108', 'M150 62 Q133 88 106 108', 'M150 62 Q140 88 120 108'],
            opacity: [0, 0, 1, 1, 0, 0],
          }}
          transition={{
            d: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
            opacity: { ...loop, times: [0, 0.09, 0.12, 0.6, 0.64, 1] },
          }}
        />
      )}
    </svg>
  )
}

export function Coffee() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' })
  return (
    <div ref={ref} className="flex h-full flex-col">
      <div className="relative mx-auto aspect-[26/31] w-full max-w-[260px]">
        <div className="pointer-events-none absolute inset-x-[10%] bottom-[2%] h-[10%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(244,162,97,0.25),transparent)]" />
        <PourOver play={inView} />
      </div>
      <p className="mt-5 text-[17px] leading-relaxed text-paper">Iced pour-over on a V60 or Kalita. New light roast every two weeks from my subscription.</p>
      <MarginNote point="up" className="mt-2">no espresso machine. not a phase.</MarginNote>
    </div>
  )
}
