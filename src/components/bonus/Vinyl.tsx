import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ALBUMS } from '../../content'

// All four records on display. Each sleeve has its record peeking out; tap one to play it.
export function Vinyl() {
  const [pick, setPick] = useState<number | null>(null)
  const album = pick === null ? null : ALBUMS[pick]

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 pt-6 sm:grid-cols-4">
        {ALBUMS.map((a, i) => {
          const active = pick === i
          return (
            <motion.button
              key={a.title}
              onClick={() => setPick(active ? null : i)}
              className="group text-left"
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ type: 'spring', stiffness: 220, damping: 22, delay: i * 0.08 }}
              aria-pressed={active}
              aria-label={`Play ${a.title} by ${a.artist}`}
            >
              <div className="relative aspect-square">
                {/* the record, sliding out of the sleeve to the right */}
                <motion.div
                  className="absolute top-[4%] left-[4%] aspect-square w-[70%] rounded-full shadow-[0_10px_24px_rgba(0,0,0,0.6)] ring-1 ring-white/20"
                  style={{ background: 'repeating-radial-gradient(circle, #151515 0 1.5px, #2a2a2a 1.5px 3px)' }}
                  initial={false}
                  animate={{ x: active ? '44%' : '24%', rotate: active ? 360 : 0 }}
                  whileHover={{ x: '34%' }}
                  transition={{
                    x: { type: 'spring', stiffness: 160, damping: 18 },
                    rotate: active ? { duration: 1.8, repeat: Infinity, ease: 'linear' } : { duration: 0.4 },
                  }}
                >
                  <img src={a.art} alt="" className="absolute inset-[33%] h-[34%] w-[34%] rounded-full object-cover" />
                  <span className="absolute inset-[48.5%] rounded-full bg-[#d9d9d9]" />
                  <span className="pointer-events-none absolute inset-0 rounded-full bg-[conic-gradient(from_210deg,transparent_0deg,rgba(255,255,255,0.18)_25deg,transparent_55deg,transparent_180deg,rgba(255,255,255,0.1)_210deg,transparent_240deg)]" />
                </motion.div>
                {/* the sleeve */}
                <motion.img
                  src={a.art}
                  alt={`${a.title} cover`}
                  className="relative aspect-square w-[78%] rounded-[6px] object-cover shadow-[8px_18px_30px_-10px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
                {active && (
                  <motion.span
                    layoutId="now-playing"
                    className="absolute -bottom-1 left-[39%] -translate-x-1/2 rounded-full bg-[#f4a261] px-2.5 py-0.5 font-mono text-[9px] font-bold tracking-[0.16em] text-ink"
                  >
                    PLAYING
                  </motion.span>
                )}
              </div>
              <p className="mt-1 leading-tight font-semibold text-paper">{a.title}</p>
              <p className="mt-0.5 text-sm text-paper/50">
                {a.artist} · {a.year}
              </p>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence initial={false}>
        {album && (
          <motion.div key="player" className="overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 28 }}>
            <iframe
              key={album.spotify}
              title={`${album.title} on Spotify`}
              src={`https://open.spotify.com/embed/album/${album.spotify}?utm_source=generator&theme=0`}
              className="mt-8 h-[152px] w-full rounded-xl"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-8 text-sm text-paper/50">
        {album ? 'Tap it again to stop.' : 'Tap a record to play it.'} Songs that are me: Ode to the Mets by The Strokes, and Champagne Supernova by Oasis.
      </p>
    </div>
  )
}
