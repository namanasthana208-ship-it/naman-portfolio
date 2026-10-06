import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { PARTS, PROFILE } from '../content'
import { GhostNumber, StepBadge } from './StepSection'
import { Kicker, MarginNote, PartBrick, Reveal, SNAP } from './ui'

// The tiny unlabelled part. Curious visitors get the Pokémon portfolio.
function HiddenConsole() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 opacity-70 hover:opacity-100"
        whileHover={{ rotate: [-4, 4, -4, 0], transition: { duration: 0.4 } }}
        aria-label="An unlabelled part"
      >
        <ConsoleIcon size={22} />
        <span className="font-mono text-xs font-bold text-manual-ink">1x ?</span>
      </motion.button>
      {createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-ink/70 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="relative w-[280px] rounded-[18px_18px_48px_18px] border-[3px] border-ink bg-[#c9c3d6] p-5 shadow-[8px_8px_0_#000]"
              initial={{ scale: 0.2, rotate: -20, y: 80 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0.4, rotate: 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-lg border-[3px] border-ink bg-[#5a5a6e] p-3">
                <div className="grid aspect-[10/9] place-items-center rounded-sm bg-[#9bbc0f] font-mono text-[#0f380f]">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
                    <p className="text-[11px] font-bold">you found the</p>
                    <p className="text-lg font-bold">SIDE QUEST</p>
                    <motion.p className="mt-3 text-xs font-bold" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                      PRESS START
                    </motion.p>
                  </motion.div>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="relative h-14 w-14">
                  <span className="absolute top-1/2 left-0 h-4 w-14 -translate-y-1/2 rounded bg-ink" />
                  <span className="absolute top-0 left-1/2 h-14 w-4 -translate-x-1/2 rounded bg-ink" />
                </div>
                <div className="flex gap-2">
                  <span className="h-8 w-8 rounded-full border-2 border-ink bg-[#9c2a5a]" />
                  <span className="mt-[-12px] h-8 w-8 rounded-full border-2 border-ink bg-[#9c2a5a]" />
                </div>
              </div>
              <a
                href={PROFILE.pokemon}
                target="_blank"
                rel="noreferrer"
                className="mx-auto mt-4 block w-fit rounded-full border-2 border-ink bg-ink px-4 py-1.5 font-mono text-xs font-bold text-white"
              >
                START ▸
              </a>
              <p className="mt-2 text-center font-mono text-[10px] text-ink/70">the pokémon edition of this portfolio</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </>
  )
}

export function ConsoleIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 20 28" aria-hidden>
      <rect x="1" y="1" width="18" height="26" rx="3" fill="#c9c3d6" stroke="#1b1813" strokeWidth="1.5" />
      <rect x="4" y="4" width="12" height="10" rx="1" fill="#9bbc0f" stroke="#1b1813" strokeWidth="1.2" />
      <path d="M5 19h4M7 17v4" stroke="#1b1813" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="14.5" cy="18" r="1.4" fill="#9c2a5a" />
      <circle cx="12.5" cy="21" r="1.4" fill="#9c2a5a" />
    </svg>
  )
}

export function Parts() {
  const local = useRef<HTMLElement | null>(null)
  return (
    <section
      ref={local}
      id="parts"
      className="relative py-16 lg:py-24"
    >
      <GhostNumber n={8} target={local} />
      <div className="relative space-y-7">
        <div className="flex items-center gap-5">
          <StepBadge n={8} />
          <div>
            <Kicker>The back of the manual</Kicker>
            <h2 className="font-display text-4xl leading-[1.02] font-extrabold tracking-tight lg:text-5xl">Parts inventory</h2>
          </div>
        </div>
        <Reveal>
          <p className="text-[18px] leading-[1.7] lg:text-[19px]">Everything I used in this build, sorted the way the back of a manual sorts bricks.</p>
        </Reveal>
        <MarginNote>one piece always goes missing. it’s tradition</MarginNote>

        <Reveal className="rounded-2xl border-2 border-ink bg-manual p-5 shadow-[6px_6px_0_#1b1813]">
          <div className="mb-4 flex items-center justify-between">
            <Kicker className="text-manual-ink">Inventory</Kicker>
            
          </div>
          <div className="space-y-5">
            {PARTS.map((g, gi) => (
              <div key={g.group}>
                <p className="mb-2 text-sm font-semibold text-manual-ink">{g.group}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {g.items.map((p, i) => (
                    <motion.div
                      key={p.name}
                      className="flex items-center gap-2 rounded-lg bg-white/70 px-2 py-1.5"
                      initial={{ y: -24, opacity: 0, rotate: -4 }}
                      whileInView={{ y: 0, opacity: 1, rotate: 0 }}
                      whileHover={{ y: -3, transition: SNAP }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 600, damping: 17, delay: gi * 0.1 + i * 0.05 }}
                    >
                      <PartBrick color={p.color} size={30} studs={i % 3 === 2 ? 1 : 2} />
                      <span className="leading-tight">
                        <span className="block font-mono text-[11px] font-bold text-manual-ink">{p.qty}</span>
                        <span className="text-sm font-medium">{p.name}</span>
                      </span>
                    </motion.div>
                  ))}
                  {gi === PARTS.length - 1 && (
                    <div className="flex items-center px-2 py-1.5">
                      <HiddenConsole />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
