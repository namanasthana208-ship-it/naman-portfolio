import { AnimatePresence, motion } from 'motion/react'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'

export type Track = { id: string; title: string; artist: string; yt: string; art: string }

// Official uploads on each artist's YouTube channel.
export const TRACKS: Track[] = [
  { id: 'touch', title: 'Touch', artist: 'Daft Punk', yt: '0Gkhol2Q1og', art: '/art/album-ram.jpg' },
  { id: 'veridis', title: 'Veridis Quo', artist: 'Daft Punk', yt: 'TCd6PfxOy0Y', art: '/art/album-discovery.jpg' },
  { id: 'mets', title: 'Ode to the Mets', artist: 'The Strokes', yt: 'LNq4xox99HY', art: '/art/album-new-abnormal.png' },
]

const KEY = 'na-soundtrack'
const VOLUME = 55

/* ---------- the YouTube IFrame API, loaded once ---------- */
type YTPlayer = {
  loadVideoById: (id: string) => void
  cueVideoById: (id: string) => void
  playVideo: () => void
  pauseVideo: () => void
  setVolume: (v: number) => void
  seekTo: (s: number) => void
  getPlayerState: () => number
}
declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: object) => YTPlayer; PlayerState: { ENDED: number; PLAYING: number; PAUSED: number } }
    onYouTubeIframeAPIReady?: () => void
  }
}
let apiPromise: Promise<void> | null = null
const loadApi = () =>
  (apiPromise ??= new Promise<void>((resolve) => {
    if (window.YT?.Player) return resolve()
    window.onYouTubeIframeAPIReady = () => resolve()
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(s)
  }))

/* ---------- shared state ---------- */
type Ctx = {
  track: Track | null
  chosen: boolean // has the visitor answered the soundtrack question this session
  playing: boolean
  choose: (id: string | null) => void
  toggle: () => void
}
const MusicCtx = createContext<Ctx | null>(null)
export const useMusic = () => useContext(MusicCtx)!

const readChoice = () => {
  try {
    return sessionStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const saved = readChoice()
  const [track, setTrack] = useState<Track | null>(() => TRACKS.find((t) => t.id === saved) ?? null)
  const [chosen, setChosen] = useState(saved !== null)
  const [playing, setPlaying] = useState(false)
  const host = useRef<HTMLDivElement>(null)
  const player = useRef<YTPlayer | null>(null)
  const pending = useRef<string | null>(null)

  // Build the player early, so the visitor's click can start sound straight away.
  useEffect(() => {
    let cancelled = false
    loadApi().then(() => {
      if (cancelled || !host.current || !window.YT) return
      const el = document.createElement('div')
      host.current.appendChild(el)
      player.current = new window.YT.Player(el, {
        width: 200,
        height: 113,
        playerVars: { playsinline: 1, controls: 0, modestbranding: 1, rel: 0 },
        events: {
          onReady: () => {
            if (pending.current) start(pending.current)
            else if (track) player.current?.cueVideoById(track.yt)
          },
          onStateChange: (e: { data: number }) => {
            const S = window.YT!.PlayerState
            if (e.data === S.ENDED) {
              player.current?.seekTo(0)
              player.current?.playVideo()
            }
            setPlaying(e.data === S.PLAYING)
          },
        },
      })
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const start = (yt: string) => {
    const p = player.current
    if (!p) {
      pending.current = yt
      return
    }
    pending.current = null
    p.setVolume(0)
    p.loadVideoById(yt)
    p.playVideo()
    // fade in (iPhones ignore volume, so there it simply starts)
    let v = 0
    const id = setInterval(() => {
      v = Math.min(VOLUME, v + 5)
      p.setVolume(v)
      if (v >= VOLUME) clearInterval(id)
    }, 120)
  }

  const choose = useCallback((id: string | null) => {
    const t = TRACKS.find((x) => x.id === id) ?? null
    try {
      sessionStorage.setItem(KEY, id ?? 'none')
    } catch {
      /* private mode */
    }
    setTrack(t)
    setChosen(true)
    if (t) start(t.yt)
    else player.current?.pauseVideo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = useCallback(() => {
    const p = player.current
    if (!p || !track) return
    if (playing) p.pauseVideo()
    else {
      p.setVolume(VOLUME)
      p.playVideo()
    }
  }, [playing, track])

  return (
    <MusicCtx.Provider value={{ track, chosen, playing, choose, toggle }}>
      {children}
      <NowPlaying host={host} />
    </MusicCtx.Provider>
  )
}

/* ---------- the soundtrack picker, shown before anything else ---------- */
export function SoundGate() {
  const { chosen, choose } = useMusic()
  useEffect(() => {
    if (chosen) return
    document.documentElement.style.overflow = 'hidden'
    loadApi()
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [chosen])

  const options = [...TRACKS.map((t) => ({ ...t, none: false })), { id: 'none', title: 'No music', artist: 'Just scrolling', yt: '', art: '', none: true }]

  return (
    <AnimatePresence>
      {!chosen && (
        <motion.div
          key="gate"
          className="fixed inset-0 z-[110] flex flex-col items-center justify-center overflow-y-auto bg-paper px-5 py-10"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(27_24_19/0.07)_1px,transparent_0)] [background-size:24px_24px]" />
          <motion.p className="relative font-mono text-[11px] font-bold tracking-[0.2em] text-ink-3 uppercase" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            Before we start
          </motion.p>
          <motion.h1
            className="relative mt-3 text-center font-display text-[clamp(2.4rem,6vw,4.4rem)] leading-[0.95] font-extrabold tracking-[-0.03em]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 26 }}
          >
            Pick a soundtrack.
          </motion.h1>
          <div className="relative mt-10 grid w-full max-w-[860px] grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
            {options.map((o, i) => (
              <motion.button
                key={o.id}
                onClick={() => choose(o.none ? null : o.id)}
                className="group text-left"
                initial={{ opacity: 0, y: 40, rotate: i % 2 ? 3 : -3 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 + i * 0.08 }}
              >
                <div className="relative aspect-[100/78]">
                  {!o.none && (
                    <span
                      className="absolute top-[6%] left-[5%] aspect-square w-[68%] rounded-full shadow-md ring-1 ring-ink/20 transition-transform duration-500 ease-out group-hover:translate-x-[38%] group-hover:rotate-90"
                      style={{ background: 'repeating-radial-gradient(circle, #151515 0 1.5px, #2a2a2a 1.5px 3px)', transform: 'translateX(20%)' }}
                    >
                      <img src={o.art} alt="" className="absolute inset-[33%] h-[34%] w-[34%] rounded-full object-cover" />
                    </span>
                  )}
                  {o.none ? (
                    <div className="relative grid aspect-square w-[78%] place-items-center rounded-[6px] border-2 border-dashed border-ink/30 bg-white/60 transition-transform group-hover:-translate-y-1.5">
                      <span className="font-display text-4xl text-ink/30">✕</span>
                    </div>
                  ) : (
                    <img
                      src={o.art}
                      alt={`${o.title} cover`}
                      className="relative aspect-square w-[78%] rounded-[6px] object-cover shadow-[8px_14px_24px_-10px_rgba(0,0,0,0.5)] ring-1 ring-ink/10 transition-transform group-hover:-translate-y-1.5"
                    />
                  )}
                </div>
                <p className="mt-3 leading-tight font-semibold">{o.title}</p>
                <p className="text-sm text-ink-3">{o.artist}</p>
              </motion.button>
            ))}
          </div>
          <motion.p className="relative mt-10 text-sm text-ink-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            You can pause or switch any time from the corner.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------- now playing: a small card with the player, folding into a pill ---------- */
function NowPlaying({ host }: { host: RefObject<HTMLDivElement | null> }) {
  const { track, chosen, playing, toggle, choose } = useMusic()
  const [open, setOpen] = useState(false) // starts as the slim pill; ▴ shows the video
  const [picking, setPicking] = useState(false)
  const visible = chosen

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-[70] w-[264px] origin-bottom-left"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20, pointerEvents: visible ? 'auto' : 'none' }}
      transition={{ type: 'spring', stiffness: 300, damping: 28, delay: visible ? 0.9 : 0 }}
    >
      <div className="overflow-hidden rounded-2xl border-2 border-ink bg-ink text-paper shadow-[4px_4px_0_rgba(0,0,0,0.35)]">
        {/* the YouTube player stays mounted; it shows when the card is open */}
        <div
          className={`overflow-hidden transition-[height] duration-300 ${open && track ? 'h-[125px]' : 'h-0'}`}
          aria-hidden={!open}
        >
          <div ref={host} className="mx-auto mt-2 h-[113px] w-[200px] overflow-hidden rounded-lg [&_iframe]:h-[113px] [&_iframe]:w-[200px]" />
        </div>
        <AnimatePresence initial={false}>
          {picking && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-b border-white/10">
              {[...TRACKS, null].map((t) => (
                <button
                  key={t?.id ?? 'none'}
                  onClick={() => {
                    choose(t?.id ?? null)
                    setPicking(false)
                  }}
                  className={`block w-full px-3 py-2 text-left text-sm hover:bg-white/10 ${track?.id === t?.id ? 'text-[#f4a261]' : ''}`}
                >
                  {t ? `${t.title} · ${t.artist}` : 'No music'}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <motion.button
            onClick={() => (track ? toggle() : setPicking((p) => !p))}
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full"
            style={{ background: 'repeating-radial-gradient(circle, #151515 0 1.2px, #2a2a2a 1.2px 2.4px)' }}
            animate={{ rotate: playing ? 360 : 0 }}
            transition={playing ? { duration: 2.4, repeat: Infinity, ease: 'linear' } : { duration: 0.3 }}
            aria-label={playing ? 'Pause music' : 'Play music'}
          >
            {track && <img src={track.art} alt="" className="absolute inset-[30%] h-[40%] w-[40%] rounded-full object-cover" />}
          </motion.button>
          <button onClick={() => setPicking((p) => !p)} className="min-w-0 flex-1 text-left" aria-label="Change song">
            <span className="block truncate text-[13px] leading-tight font-semibold">{track ? track.title : 'Music off'}</span>
            <span className="block truncate text-[11px] text-paper/55">{track ? `${track.artist} · tap to change` : 'tap to pick a song'}</span>
          </button>
          {track && (
            <button onClick={toggle} className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-xs hover:bg-white/20" aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? '❚❚' : '▶'}
            </button>
          )}
          {track && (
            <button onClick={() => setOpen((o) => !o)} className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs text-paper/60 hover:bg-white/10" aria-label={open ? 'Hide video' : 'Show video'}>
              {open ? '▾' : '▴'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
