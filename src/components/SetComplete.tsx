import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { PROFILE } from '../content'
import { DropText, Kicker, MarginNote, Reveal } from './ui'

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(PROFILE.email).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1600)
        })
      }}
      className="group flex w-full items-center justify-between rounded-xl border-2 border-ink bg-white px-4 py-3 text-left shadow-[4px_4px_0_#1b1813] transition-transform active:translate-y-[2px]"
    >
      <span>
        <span className="block font-mono text-[11px] font-bold tracking-[0.14em] text-ink-3 uppercase">Email</span>
        <span className="font-medium break-all">{PROFILE.email}</span>
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'y' : 'n'}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          className={`ml-3 shrink-0 rounded-md px-2 py-1 font-mono text-[11px] font-bold ${copied ? 'bg-green-600 text-white' : 'bg-yellow-300'}`}
        >
          {copied ? 'COPIED' : 'COPY'}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export function SetComplete() {
  const links = [
    { k: 'Phone', v: PROFILE.phone, href: PROFILE.phoneHref },
    { k: 'LinkedIn', v: 'naman-asthana', href: PROFILE.linkedin },
    { k: 'X', v: '@deewanaasthana', href: PROFILE.x },
    { k: 'CV', v: 'Download PDF', href: PROFILE.cv },
  ]
  return (
    <section id="contact" className="relative py-20 lg:py-28">
      <Kicker>Final step</Kicker>
      <h2 className="mt-3 font-display text-[clamp(3rem,7vw,5.6rem)] leading-[0.95] font-extrabold tracking-[-0.03em]">
        <DropText text="Set complete." />
      </h2>
      <Reveal className="mt-6">
        <p className="text-[20px] leading-[1.6] lg:text-[22px]">If you’re hiring for growth, or you work in coffee, let’s talk. I’m in Lucknow right now but happy to move.</p>
      </Reveal>
      <MarginNote className="mt-3">I pick up calls</MarginNote>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Reveal>
            <CopyEmail />
          </Reveal>
        </div>
        {links.map((l, i) => (
          <Reveal key={l.k} delay={0.05 * i}>
            <a
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              download={l.k === 'CV' ? 'Naman_Asthana_CV.pdf' : undefined}
              className="block rounded-xl border-2 border-ink bg-white px-4 py-3 shadow-[4px_4px_0_#1b1813] transition-transform hover:-translate-y-0.5 active:translate-y-[2px]"
            >
              <span className="block font-mono text-[11px] font-bold tracking-[0.14em] text-ink-3 uppercase">{l.k}</span>
              <span className="font-medium">{l.v} ↗</span>
            </a>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10">
        <a href="#bonus" className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.18em] text-ink-2 uppercase hover:text-brick">
          Bonus sets ↓
        </a>
      </Reveal>
    </section>
  )
}
