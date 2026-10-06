import Lenis from 'lenis'
import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { Bonus } from './components/bonus/Bonus'
import { Cover } from './components/Cover'
import { Nav } from './components/Nav'
import { Parts } from './components/Parts'
import { SetComplete } from './components/SetComplete'
import { StepSection } from './components/StepSection'
import { STEPS } from './content'

export default function App() {
  // smooth scrolling, and anchor links that glide instead of jump
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 })
    if (import.meta.env.DEV) Object.assign(window, { __lenis: lenis })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const el = document.querySelector(a.getAttribute('href')!)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el as HTMLElement, { offset: -20, duration: 1.6 })
    }
    document.addEventListener('click', onClick)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      lenis.destroy()
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main className="relative mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <Cover />
        {STEPS.map((s) => (
          <StepSection key={s.n} step={s} />
        ))}
        <Parts />
        <SetComplete />
      </main>
      <Bonus />
      <footer className="bg-[#100d0a] px-5 pt-6 pb-12 text-center text-sm text-paper/50">
        <p>Built brick by brick by Naman Asthana · Lucknow</p>
        <p className="mx-auto mt-2 max-w-3xl text-xs text-paper/35">
          Album, film, show and comic artwork belongs to its respective owners and is shown for personal, non-commercial reference. Not affiliated with or endorsed by the LEGO Group.
        </p>
      </footer>
      <div className="grain pointer-events-none fixed inset-0 z-[60]" aria-hidden />
    </MotionConfig>
  )
}
