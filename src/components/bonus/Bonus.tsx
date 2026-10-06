import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import type { ReactNode } from 'react'
import { DropText } from '../ui'
import { Cinema } from './Cinema'
import { Coffee } from './Coffee'
import { Comics, Football, Photos, Superman, TV } from './Sets'
import { Vinyl } from './Vinyl'

// A display case: a soft spotlight follows the cursor and the card leans toward it a touch.
function Card({ n, title, children, className = '' }: { n: number; title: string; children: ReactNode; className?: string }) {
  const mx = useMotionValue(-400)
  const my = useMotionValue(-400)
  const rx = useSpring(0, { stiffness: 150, damping: 18 })
  const ry = useSpring(0, { stiffness: 150, damping: 18 })
  const light = useMotionTemplate`radial-gradient(520px circle at ${mx}px ${my}px, rgba(255,196,128,0.10), transparent 45%)`
  return (
    <motion.article
      className={`group relative flex min-w-0 flex-col overflow-hidden rounded-[28px] border border-white/[0.07] bg-[linear-gradient(180deg,#201a14_0%,#18140f_100%)] p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] lg:p-8 ${className}`}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1400 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ type: 'spring', stiffness: 160, damping: 22 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set(e.clientX - r.left)
        my.set(e.clientY - r.top)
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 2.2)
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 2.2)
      }}
      onPointerLeave={() => {
        mx.set(-400)
        my.set(-400)
        rx.set(0)
        ry.set(0)
      }}
    >
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: light }} />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <header className="relative mb-6 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-[1.7rem] leading-tight font-bold tracking-tight text-paper">{title}</h3>
        <span className="font-mono text-[11px] font-bold tracking-[0.22em] text-gold/70">{String(n).padStart(2, '0')}</span>
      </header>
      <div className="relative flex flex-1 flex-col">{children}</div>
    </motion.article>
  )
}

export function Bonus() {
  return (
    <section id="bonus" className="on-dark relative overflow-hidden bg-[#14110d]">
      <div className="h-40 bg-gradient-to-b from-paper to-[#14110d]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_20%_10%,rgba(233,163,90,0.12),transparent),radial-gradient(ellipse_60%_40%_at_90%_60%,rgba(180,99,47,0.10),transparent)]" />
      <div className="relative mx-auto max-w-[1360px] px-5 pb-28 sm:px-8 lg:px-14 xl:px-20">
        <p className="font-mono text-[11px] font-bold tracking-[0.22em] text-gold/80 uppercase">Off the clock</p>
        <h2 className="mt-3 font-display text-[clamp(3rem,7vw,6rem)] leading-[0.92] font-extrabold tracking-[-0.035em] text-paper">
          <DropText text="Bonus sets" />
        </h2>
        <motion.p
          className="mt-5 max-w-2xl text-[19px] leading-relaxed text-paper/70"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          This is the part I actually wanted to build.
        </motion.p>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          <Card n={1} title="On the turntable" className="lg:col-span-8">
            <Vinyl />
          </Card>
          <Card n={2} title="Coffee" className="lg:col-span-4">
            <Coffee />
          </Card>
          <Card n={3} title="Films I’ll rewatch" className="lg:col-span-12">
            <Cinema />
          </Card>
          <Card n={4} title="On the shelf" className="lg:col-span-8">
            <Comics />
          </Card>
          <Card n={5} title="Superman" className="lg:col-span-4">
            <Superman />
          </Card>
          <Card n={6} title="On TV" className="lg:col-span-6">
            <TV />
          </Card>
          <Card n={7} title="Barça" className="lg:col-span-6">
            <Football />
          </Card>
          <Card n={8} title="Photos" className="lg:col-span-12">
            <Photos />
          </Card>
        </div>
      </div>
    </section>
  )
}
