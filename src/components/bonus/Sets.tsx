import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { COMICS, PHOTOS, SHOWS } from '../../content'
import { MarginNote } from '../ui'
import { MiniModel, at, rectStyle } from './MiniModel'
import { camera, tv } from './models'

/* ---------- TV ---------- */
export function TV() {
  const bricks = useMemo(tv, [])
  const [ch, setCh] = useState(0)
  const [built, setBuilt] = useState(false)
  const show = SHOWS[ch]
  const next = () => setCh((c) => (c + 1) % SHOWS.length)
  return (
    <div className="relative">
      <div className="pointer-events-none absolute top-[12%] left-1/2 h-[70%] w-[80%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(150,190,255,0.16),transparent)] blur-xl" />
      <MiniModel bricks={bricks} duration={1.4} className="mx-auto w-full max-w-[380px]" onBuilt={() => setBuilt(true)}>
        {(box) => (
          <>
            <div className="absolute overflow-hidden rounded-[4px] bg-black" style={rectStyle(box, 2, 3, 12, 10)}>
              <AnimatePresence mode="wait">
                {built && (
                  <motion.div
                    key={ch}
                    className="absolute inset-0"
                    initial={{ scaleY: 0.02, opacity: 0.4, filter: 'brightness(3)' }}
                    animate={{ scaleY: 1, opacity: 1, filter: 'brightness(1)' }}
                    exit={{ scaleY: 0.02, opacity: 0.5, filter: 'brightness(3)' }}
                    transition={{ duration: 0.22 }}
                  >
                    {show.art ? (
                      <img src={show.art} alt={`${show.title} artwork`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-[#d9e7ee] text-center">
                        <span className="font-display text-[clamp(14px,3.2vw,26px)] font-light tracking-[0.35em] text-[#123] uppercase">Severance</span>
                      </div>
                    )}
                    {show.now && <span className="absolute top-1.5 left-1.5 rounded bg-brick px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">NOW WATCHING</span>}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.12)_0_1px,transparent_1px_3px)]" />
            </div>
            <button
              onClick={next}
              aria-label="Next channel"
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full ring-brick hover:ring-4"
              style={{ left: `${at(box, 13.5, -1, 8.5).left}%`, top: `${at(box, 13.5, -1, 8.5).top}%`, width: '9%', aspectRatio: '1' }}
            />
          </>
        )}
      </MiniModel>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate font-semibold">
          <span className="font-mono text-xs text-paper/45">CH {String(ch + 1).padStart(2, '0')}</span> {show.title}
        </p>
        <motion.button whileTap={{ scale: 0.94 }} onClick={next} className="shrink-0 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-paper ring-1 ring-white/15 transition-colors hover:bg-white/15">
          Change channel
        </motion.button>
      </div>
      <p className="mt-3 text-sm text-paper/50">The Office, House MD, Avatar: The Last Airbender, Doctor Who. Watching Lanterns and Severance right now.</p>
    </div>
  )
}

/* ---------- Comics ---------- */
export function Comics() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4 lg:gap-x-7">
        {COMICS.map((c, i) => (
          <motion.figure
            key={c.title}
            className="group"
            initial={{ y: 40, opacity: 0, rotateY: -30 }}
            whileInView={{ y: 0, opacity: 1, rotateY: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ type: 'spring', stiffness: 220, damping: 22, delay: i * 0.06 }}
            style={{ transformPerspective: 900 }}
          >
            <motion.div className="relative overflow-hidden rounded-md" whileHover={{ y: -10, rotate: i % 2 ? 1.5 : -1.5 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
              <img src={c.art} alt={`${c.title} cover`} loading="lazy" className="aspect-[2/3] w-full object-cover shadow-[0_22px_36px_-14px_rgba(0,0,0,0.9)]" />
              <span className="pointer-events-none absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-black/35 to-transparent" />
              <span className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-white/10 ring-inset" />
            </motion.div>
            <figcaption className="mt-3">
              <p className="text-[15px] leading-tight font-semibold text-paper">{c.title}</p>
              <p className="mt-1 text-[13px] leading-snug text-paper/45">{c.by}</p>
            </figcaption>
            {c.note && <p className="hand mt-1.5 text-lg leading-tight">{c.note}</p>}
          </motion.figure>
        ))}
      </div>
      <p className="mt-auto pt-8 text-sm text-paper/50">Mostly DC and manga. Favourite writers: Scott Snyder and Geoff Johns.</p>
    </div>
  )
}

/* ---------- Superman ---------- */
// The poster fills the card; the words sit over its darkest part.
export function Superman() {
  return (
    <motion.div
      className="group relative min-h-[420px] flex-1 overflow-hidden rounded-2xl ring-1 ring-white/10"
      initial={{ opacity: 0, scale: 1.04 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <img
        src="/art/film-superman-2025.jpg"
        alt="Superman (2025) poster"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-[50%_20%] transition-transform duration-[1.2s] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-gold/80 uppercase">Favourite superhero</p>
        <p className="mt-1.5 font-display text-2xl leading-tight font-bold text-paper">Superman, since I was 10.</p>
        <MarginNote point="up" className="mt-2">superman (2025), I’ll fight you on it</MarginNote>
      </div>
    </motion.div>
  )
}

/* ---------- Football ---------- */
export function Football() {
  const facts = [
    { k: 'Club', v: 'FC Barcelona' },
    { k: 'Player', v: 'Lionel Messi' },
    { k: 'The match', v: '2009 Champions League final, Rome' },
  ]
  return (
    <div className="flex flex-1 flex-col">
      <motion.figure
        className="group relative min-h-[260px] flex-1 overflow-hidden rounded-2xl ring-1 ring-white/10"
        initial={{ opacity: 0, scale: 1.04 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <img
          src="/art/messi-rome-2009.webp"
          alt="Messi celebrating his goal in the 2009 Champions League final in Rome"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-[50%_30%] transition-transform duration-[1.2s] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
        <MarginNote className="absolute top-[18%] left-[47%] pr-3 [&_p]:text-[1.35rem] [&_p]:leading-tight [&_p]:[text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">messi scored with his HEAD</MarginNote>
      </motion.figure>
      <dl className="mt-5 grid grid-cols-3 gap-4">
        {facts.map((f) => (
          <div key={f.k}>
            <dt className="font-mono text-[10px] font-bold tracking-[0.2em] text-gold/70 uppercase">{f.k}</dt>
            <dd className="mt-1 leading-snug text-paper">{f.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/* ---------- Camera + photos ---------- */
export function Photos() {
  const bricks = useMemo(camera, [])
  const [flash, setFlash] = useState(0)
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="grid gap-8 lg:grid-cols-[0.6fr_1.4fr] lg:items-center">
      <div>
        <motion.button className="relative block w-full max-w-[260px]" onClick={() => setFlash((f) => f + 1)} whileTap={{ scale: 0.97 }} aria-label="Take a photo">
          <MiniModel bricks={bricks} duration={1.2} className="w-full" />
        </motion.button>
        <p className="mt-3 text-[15px] text-paper/60">Street photography, mostly black and white. Press the camera.</p>
      </div>
      <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3">
        {PHOTOS.map((p, i) => (
          <motion.button
            key={`${p.src}-${flash}`}
            onClick={() => setOpen(i)}
            className="group overflow-hidden rounded-xl bg-black ring-1 ring-white/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <motion.img
              layoutId={`photo-${i}`}
              src={p.src}
              alt={p.alt}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
              initial={{ filter: 'brightness(0.05) contrast(1.6) blur(6px)' }}
              whileInView={{ filter: 'brightness(1) contrast(1) blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 0.3 + i * 0.35, ease: 'easeOut' }}
            />
          </motion.button>
        ))}
        {createPortal(
          <AnimatePresence>
            {flash > 0 && (
              <motion.div key={flash} className="pointer-events-none fixed inset-0 z-[90] bg-white" initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }} />
            )}
          </AnimatePresence>,
          document.body,
        )}
      </div>
      {createPortal(
        <AnimatePresence>
          {open !== null && (
            <motion.div className="fixed inset-0 z-[85] grid place-items-center bg-black/90 p-5 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
              <motion.img layoutId={`photo-${open}`} src={PHOTOS[open].src} alt={PHOTOS[open].alt} className="max-h-[86vh] max-w-full rounded-xl object-contain shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}
