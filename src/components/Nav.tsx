import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { useState } from 'react'

const LINKS = [
  { href: '#step-1', label: 'Work' },
  { href: '#parts', label: 'Parts' },
  { href: '#bonus', label: 'Bonus' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  const { scrollY, scrollYProgress } = useScroll()
  const [hidden, setHidden] = useState(false)
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 400)
  })

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 lg:px-6"
      animate={{ y: hidden ? -90 : 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 36 }}
    >
      <nav className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 rounded-xl border-2 border-ink bg-paper/90 px-3 py-2 backdrop-blur-md">
        <a href="#top" className="flex items-center gap-2" aria-label="Back to top">
          <span className="studs-top grid h-8 w-11 place-items-center rounded-[4px] border-2 border-ink bg-brick font-display text-sm font-extrabold text-white" style={{ ['--stud' as string]: '#d7372a' }}>
            NA
          </span>
          <span className="hidden font-display font-bold sm:inline">Naman Asthana</span>
        </a>
        <div className="flex items-center sm:gap-2">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="rounded-md px-1.5 py-1 text-[13px] font-medium hover:bg-ink hover:text-paper sm:px-3 sm:text-sm">
              {l.label}
            </a>
          ))}
        </div>
      </nav>
      <div className="mx-auto mt-1 h-[3px] max-w-[1500px] overflow-hidden rounded-full bg-ink/10">
        <motion.div className="h-full origin-left bg-brick" style={{ scaleX: progress }} />
      </div>
    </motion.header>
  )
}
