import { motion } from 'motion/react'

const CAC = [
  { label: 'Before', value: '$23.55', n: 23.55 },
  { label: 'OTP fix', value: '$9', n: 9 },
  { label: 'Deep linking', value: '$7.90', n: 7.9 },
  { label: 'Fixed the fix', value: '$6.10', n: 6.1 },
]

const BRICK_COLORS = ['#d7372a', '#f5c21b', '#2c7cc6', '#3fa04b']

// Cost per signup as four stacks of bricks that get shorter with each fix.
export function CacFix() {
  let delay = 0.1
  return (
    <div className="rounded-xl border-2 border-ink bg-white p-4">
      <p className="mb-4 font-mono text-[11px] font-bold tracking-[0.18em] text-ink-3 uppercase">Cost per signup · 1 brick ≈ $1.50</p>
      <div className="flex items-end justify-between gap-2 sm:gap-4">
        {CAC.map((c, ci) => {
          const bricks = Math.max(1, Math.round(c.n / 1.5))
          const start = delay
          delay += bricks * 0.03 + 0.25
          return (
            <div key={c.label} className="flex flex-1 flex-col items-center">
              <motion.span
                className="tabular mb-2 font-display text-lg font-extrabold sm:text-2xl"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: start + bricks * 0.03 }}
              >
                {c.value}
              </motion.span>
              <div className="flex w-full max-w-[64px] flex-col-reverse gap-[2px]">
                {Array.from({ length: bricks }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="studs-top h-[10px] rounded-[2px] border border-ink/70"
                    style={{ background: BRICK_COLORS[ci], ['--stud' as string]: BRICK_COLORS[ci] }}
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 700, damping: 20, delay: start + i * 0.03 }}
                  />
                ))}
              </div>
              <span className="mt-2 text-center text-xs font-medium text-ink-2 sm:text-sm">{c.label}</span>
            </div>
          )
        })}
      </div>
      <motion.p className="hand mt-4 text-right text-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        74% cheaper
      </motion.p>
    </div>
  )
}
