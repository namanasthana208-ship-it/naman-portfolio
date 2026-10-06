import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { FILMS_MORE, FILMS_TOP4, PROFILE } from '../../content'

type Watch = { title: string; year: string; rating: number | null; liked: boolean; rewatch: boolean; poster: string | null; review: string | null; link: string; watched: string }

const stars = (r: number | null) => (r == null ? '' : '★'.repeat(Math.floor(r)) + (r % 1 ? '½' : ''))

function Bulbs() {
  return (
    <div className="flex justify-between px-3" aria-hidden>
      {Array.from({ length: 22 }).map((_, i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-[#ffd98a]"
          animate={{ opacity: [1, 0.3, 1], boxShadow: ['0 0 10px #ffcf6b', '0 0 2px #ffcf6b', '0 0 10px #ffcf6b'] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: (i % 3) * 0.45 }}
        />
      ))}
    </div>
  )
}

function Poster({ src, title, sub, i, note, big }: { src: string; title: string; sub?: string; i: number; note?: string; big?: boolean }) {
  return (
    <motion.figure
      className="group relative"
      initial={{ y: 50, opacity: 0, rotateX: 25 }}
      whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ type: 'spring', stiffness: 220, damping: 22, delay: i * 0.08 }}
      style={{ transformPerspective: 900 }}
    >
      <motion.div className="relative overflow-hidden rounded-lg" whileHover={{ y: -10, scale: 1.03 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
        <img src={src} alt={`${title} poster`} loading="lazy" className="aspect-[2/3] w-full object-cover shadow-[0_24px_40px_-16px_rgba(0,0,0,0.9)]" />
        <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/10 ring-inset" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/15 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </motion.div>
      <figcaption className={`mt-3 leading-tight ${big ? 'text-[15px]' : 'text-sm'}`}>
        <span className="font-semibold text-paper">{title}</span>
        {sub && <span className="text-paper/45"> · {sub}</span>}
      </figcaption>
      {note && <p className="hand mt-1 text-lg">{note}</p>}
    </motion.figure>
  )
}

export function Cinema() {
  const [recent, setRecent] = useState<Watch[] | null>(null)
  useEffect(() => {
    fetch('/api/letterboxd')
      .then((r) => (r.ok ? r.json() : []))
      .then((d: Watch[]) => setRecent(d.slice(0, 3)))
      .catch(() => setRecent([]))
  }, [])

  return (
    <div>
      <div className="rounded-2xl bg-[linear-gradient(180deg,#2a0f0c,#1a0907)] px-3 py-4 ring-1 ring-[#ffcf6b]/20">
        <Bulbs />
        <p className="my-3 text-center font-display text-2xl font-extrabold tracking-[0.35em] text-[#ffe2a8] uppercase [text-shadow:0_0_18px_rgba(255,190,90,0.55)] lg:text-3xl">
          Now showing
        </p>
        <Bulbs />
      </div>

      <p className="mt-8 mb-4 font-mono text-[11px] font-bold tracking-[0.2em] text-gold/70 uppercase">My Letterboxd top 4</p>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 lg:gap-7">
        {FILMS_TOP4.map((f, i) => (
          <Poster key={f.title} src={f.art} title={f.title} sub={f.year} i={i} note={f.note} big />
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.35fr]">
        <div>
          <p className="mb-4 font-mono text-[11px] font-bold tracking-[0.2em] text-gold/70 uppercase">Also on repeat</p>
          <div className="grid grid-cols-3 gap-4">
            {FILMS_MORE.map((f, i) => (
              <Poster key={f.title} src={f.art} title={f.title} sub={f.year} i={i} />
            ))}
          </div>
          <p className="mt-4 text-sm text-paper/50">Picking a top 3 was not happening.</p>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <motion.span className="h-2 w-2 rounded-full bg-[#ff5a3c]" animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
            <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-gold/70 uppercase">Last watched · live from Letterboxd</p>
          </div>
          <div className="space-y-3">
            {recent === null &&
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-[96px] animate-pulse rounded-2xl bg-white/[0.04] ring-1 ring-white/10" />)}
            {recent?.map((w, i) => (
              <motion.a
                key={w.link}
                href={w.link}
                target="_blank"
                rel="noreferrer"
                className="flex gap-4 rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10 transition-colors hover:bg-white/[0.07]"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 380, damping: 24, delay: i * 0.08 }}
              >
                {w.poster && <img src={w.poster} alt="" className="h-[78px] w-[52px] shrink-0 rounded-md object-cover shadow-lg" loading="lazy" />}
                <div className="min-w-0 py-0.5">
                  <p className="truncate font-semibold text-paper">
                    {w.title} <span className="font-normal text-paper/40">{w.year}</span>
                  </p>
                  <p className="text-sm text-[#00e054]">
                    {stars(w.rating)} {w.liked && <span className="text-[#ff8000]">♥</span>} {w.rewatch && <span className="ml-1 text-xs text-paper/40">rewatch</span>}
                  </p>
                  {w.review && <p className="hand truncate text-lg">“{w.review}”</p>}
                </div>
              </motion.a>
            ))}
            {recent?.length === 0 && <p className="text-sm text-paper/50">Letterboxd is taking a break. The diary is one click away.</p>}
          </div>
          <a href={PROFILE.letterboxd} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.2em] text-paper/70 uppercase hover:text-[#f4a261]">
            Full diary on Letterboxd ↗
          </a>
        </div>
      </div>
    </div>
  )
}
