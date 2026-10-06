// Oblique "instruction manual" projection for brick models.
// x runs right, y runs back (away from the viewer), z runs up. Units are studs (x, y) and bricks (z).
// We look from the front, a little from the right and above, so front, top and right faces show.

export type Palette = { top: string; front: string; side: string }

export type Shape = 'box' | 'round' | 'cone' | 'dome'

export type Brick = {
  id: number
  x: number
  y: number
  z: number
  w: number
  d: number
  h: number
  color: string
  step: number
  studs?: boolean
  transparent?: boolean
  shape?: Shape
}

// `fill` is a colour, or `grad:<colour>` for the rounded-shape gradient of that palette.
export type Face = { points?: string; d?: string; fill: string; kind: 'top' | 'front' | 'side' }
export type Stud = { cx: number; cy: number; color: Palette; r?: number }

export type RenderBrick = Omit<Brick, 'studs'> & { faces: Face[]; studs: Stud[]; order: number }

export const U = 12 // stud pitch in px
export const H = 14 // brick height in px
export const DX = 6 // screen shift per stud of depth
export const DY = 5

export const COLORS: Record<string, Palette> = {
  // Rumi Darwaza sandstone
  sand: { top: '#F1CF9C', front: '#DFAF73', side: '#BC8A50' },
  sandDark: { top: '#D9A56B', front: '#C08A4F', side: '#9A6A38' },
  peach: { top: '#F6DDB4', front: '#EBC38D', side: '#C99D63' },
  cream: { top: '#FFF3DA', front: '#F6E2BC', side: '#D6BE92' },
  rust: { top: '#D38450', front: '#B4632F', side: '#8C4A21' },
  redBrown: { top: '#A9603A', front: '#8B4626', side: '#69331B' },
  shadow: { top: '#7A5236', front: '#5E3C25', side: '#472C1A' },
  ivory: { top: '#F7F0E0', front: '#E9DEC6', side: '#C9BB9C' },
  terracotta: { top: '#D9825B', front: '#BF6440', side: '#984B2E' },
  gold: { top: '#FBDA6E', front: '#E9B536', side: '#BB8B1C' },
  // ground and props
  plate: { top: '#CDD1D4', front: '#A9AFB4', side: '#8A9095' },
  tile: { top: '#B9BEC2', front: '#9DA3A8', side: '#80868B' },
  leaf: { top: '#6FBF5C', front: '#4E9E3E', side: '#3A7A2D' },
  leafDark: { top: '#4F9A49', front: '#3A7E35', side: '#2B6027' },
  // general purpose
  white: { top: '#FFFFFF', front: '#F1F1EE', side: '#CFCFCA' },
  black: { top: '#45474B', front: '#2C2E31', side: '#1C1D1F' },
  red: { top: '#F0584A', front: '#D7372A', side: '#A6261C' },
  blue: { top: '#4E9BE0', front: '#2C7CC6', side: '#1F5E99' },
  yellow: { top: '#FFD84A', front: '#F5C21B', side: '#C49A10' },
  green: { top: '#5FBF6A', front: '#3FA04B', side: '#2E7A38' },
  brown: { top: '#9A6A45', front: '#7D5232', side: '#5C3B23' },
  coffee: { top: '#7A4A2A', front: '#5E361C', side: '#432512' },
  glass: { top: 'rgba(220,238,248,0.55)', front: 'rgba(200,226,242,0.38)', side: 'rgba(170,205,228,0.5)' },
  ice: { top: '#F4FBFF', front: '#DDF0FA', side: '#BCDDEE' },
  grey: { top: '#A3A8AD', front: '#878C91', side: '#6B7075' },
  darkGrey: { top: '#6F7378', front: '#575B60', side: '#3F4246' },
  navy: { top: '#3C4F7A', front: '#2B3B60', side: '#1E2A45' },
  sandLegacy: { top: '#EAD6B0', front: '#D7BA8A', side: '#B79868' },
}

export const project = (x: number, y: number, z: number): [number, number] => [x * U + y * DX, -z * H - y * DY]

const f1 = (n: number) => n.toFixed(1)
const pts = (...p: [number, number][]) => p.map(([a, b]) => `${f1(a)},${f1(b)}`).join(' ')

const key = (x: number, y: number, z: number) => `${x},${y},${z}`

const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${f1(cx - rx)},${f1(cy)} A${f1(rx)} ${f1(ry)} 0 1 0 ${f1(cx + rx)},${f1(cy)} A${f1(rx)} ${f1(ry)} 0 1 0 ${f1(cx - rx)},${f1(cy)} Z`

// Rounded parts: cylinders, cones (spikes and finials) and onion domes.
function shapeFaces(b: Brick, c: Palette, coveredTop: boolean): { faces: Face[]; studs: Stud[] } {
  const [cx, cyB] = project(b.x + b.w / 2, b.y + b.d / 2, b.z)
  const [, cyT] = project(b.x + b.w / 2, b.y + b.d / 2, b.z + b.h)
  const rx = (b.w * U) / 2
  const ry = Math.max(1.6, (b.d * DY) / 2 + 0.4)
  const grad = `grad:${b.color}`
  const faces: Face[] = []
  const studs: Stud[] = []

  if (b.shape === 'round') {
    faces.push({
      kind: 'front',
      fill: grad,
      d: `M${f1(cx - rx)},${f1(cyT)} L${f1(cx - rx)},${f1(cyB)} A${f1(rx)} ${f1(ry)} 0 0 0 ${f1(cx + rx)},${f1(cyB)} L${f1(cx + rx)},${f1(cyT)} Z`,
    })
    if (!coveredTop) {
      faces.push({ kind: 'top', fill: c.top, d: ellipse(cx, cyT, rx, ry) })
      if (b.studs !== false) studs.push({ cx, cy: cyT, color: c, r: Math.min(3.6, rx * 0.55) })
    }
  } else if (b.shape === 'cone') {
    faces.push({
      kind: 'front',
      fill: grad,
      d: `M${f1(cx - rx)},${f1(cyB)} A${f1(rx)} ${f1(ry)} 0 0 0 ${f1(cx + rx)},${f1(cyB)} L${f1(cx)},${f1(cyT)} Z`,
    })
  } else if (b.shape === 'dome') {
    const hp = cyB - cyT
    faces.push({
      kind: 'front',
      fill: grad,
      d:
        `M${f1(cx - rx * 0.92)},${f1(cyB)} ` +
        `C${f1(cx - rx * 1.22)},${f1(cyB - hp * 0.55)} ${f1(cx - rx * 0.32)},${f1(cyB - hp * 0.8)} ${f1(cx)},${f1(cyT)} ` +
        `C${f1(cx + rx * 0.32)},${f1(cyB - hp * 0.8)} ${f1(cx + rx * 1.22)},${f1(cyB - hp * 0.55)} ${f1(cx + rx * 0.92)},${f1(cyB)} ` +
        `A${f1(rx * 0.92)} ${f1(ry)} 0 0 1 ${f1(cx - rx * 0.92)},${f1(cyB)} Z`,
    })
  }
  return { faces, studs }
}

// Turns raw bricks into drawable faces, culling faces and studs hidden by neighbours,
// and sorts them back-to-front so plain painter's order is correct.
export function prepare(bricks: Brick[]): RenderBrick[] {
  const solid = new Set<string>() // full boxes: hide neighbouring side faces
  const above = new Set<string>() // anything sitting on a cell: hides the top and stud below
  for (const b of bricks) {
    if (b.transparent || b.h < 1) continue
    const isBox = !b.shape || b.shape === 'box'
    for (let i = 0; i < b.w; i++)
      for (let j = 0; j < b.d; j++)
        for (let k = 0; k < b.h; k++) {
          const kk = key(Math.floor(b.x + i), Math.floor(b.y + j), Math.floor(b.z + k))
          above.add(kk)
          if (isBox) solid.add(kk)
        }
  }
  const has = (x: number, y: number, z: number) => solid.has(key(x, y, z))
  const covered = (x: number, y: number, z: number) => above.has(key(Math.floor(x), Math.floor(y), z))

  // flat ground plates go down first, then everything else back to front
  const ground = (b: Brick) => (b.z + b.h <= 0.45 ? 0 : 1)
  const sorted = [...bricks].sort((a, b) => ground(a) - ground(b) || b.y - a.y || a.z - b.z || a.x - b.x)

  return sorted.map((b, order) => {
    const c = COLORS[b.color] ?? COLORS.sand
    const { x, y, z, w, d, h } = b
    const top = z + h

    if (b.shape && b.shape !== 'box') {
      const { faces, studs } = shapeFaces(b, c, covered(x + w / 2 - 0.5, y + d / 2 - 0.5, Math.ceil(top - 0.001)))
      return { ...b, faces, studs, order }
    }

    const faces: Face[] = []
    const studs: Stud[] = []

    faces.push({ kind: 'front', fill: c.front, points: pts(project(x, y, z), project(x + w, y, z), project(x + w, y, top), project(x, y, top)) })

    // right face, one segment per stud of depth so partly hidden sides are handled
    for (let j = 0; j < d; j++) {
      if (!b.transparent && h >= 1 && has(x + w, y + j, Math.floor(z))) continue
      faces.push({
        kind: 'side',
        fill: c.side,
        points: pts(project(x + w, y + j, z), project(x + w, y + j + 1, z), project(x + w, y + j + 1, top), project(x + w, y + j, top)),
      })
    }

    // top face, per cell, plus studs
    const topZ = Number.isInteger(top) ? top : Math.ceil(top)
    const big = w * d > 24 // baseplates: one top face, everything above paints over it
    if (big) faces.push({ kind: 'top', fill: c.top, points: pts(project(x, y, top), project(x + w, y, top), project(x + w, y + d, top), project(x, y + d, top)) })
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < d; j++) {
        if (!b.transparent && covered(x + i, y + j, topZ)) continue
        if (!big) {
          faces.push({
            kind: 'top',
            fill: c.top,
            points: pts(project(x + i, y + j, top), project(x + i + 1, y + j, top), project(x + i + 1, y + j + 1, top), project(x + i, y + j + 1, top)),
          })
        }
        if (b.studs !== false) {
          const [cx, cy] = project(x + i + 0.5, y + j + 0.5, top)
          studs.push({ cx, cy, color: c })
        }
      }
    }
    return { ...b, faces, studs, order }
  })
}

export function bounds(bricks: Brick[], pad = 16) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const b of bricks) {
    for (const [px, py] of [
      project(b.x, b.y, b.z),
      project(b.x + b.w, b.y + b.d, b.z),
      project(b.x + b.w, b.y, b.z),
      project(b.x, b.y + b.d, b.z + b.h),
      project(b.x + b.w, b.y + b.d, b.z + b.h),
    ]) {
      minX = Math.min(minX, px)
      maxX = Math.max(maxX, px)
      minY = Math.min(minY, py - 4)
      maxY = Math.max(maxY, py + 4)
    }
  }
  return { x: minX - pad, y: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 }
}

// Helpers for building models out of rows of bricks.
export class Builder {
  bricks: Brick[] = []
  private id = 0
  step = 0

  add(x: number, y: number, z: number, w: number, d: number, color: string, opts: Partial<Brick> = {}) {
    this.bricks.push({ id: this.id++, x, y, z, w, d, h: 1, color, step: this.step, ...opts })
  }

  round(x: number, y: number, z: number, size: number, color: string, opts: Partial<Brick> = {}) {
    this.add(x, y, z, size, size, color, { shape: 'round', ...opts })
  }

  cone(x: number, y: number, z: number, color: string, opts: Partial<Brick> = {}) {
    this.add(x, y, z, 1, 1, color, { shape: 'cone', ...opts })
  }

  // Lays a horizontal run in running bond: alternate layers start with a half brick.
  run(x0: number, x1: number, y: number, z: number, d: number, color: string, opts: Partial<Brick> = {}) {
    let x = x0
    let first = (z + x0) % 2 === 0 ? 4 : 2
    while (x <= x1) {
      const left = x1 - x + 1
      let len = Math.min(first, left)
      if (left - len === 1 && len > 2) len -= 1 // avoid leaving a lone 1x1
      this.add(x, y, z, len, d, color, opts)
      x += len
      first = 4
    }
  }

  // A row with gaps: ranges are inclusive [from, to] pairs to fill.
  rows(ranges: [number, number][], y: number, z: number, d: number, color: string, opts: Partial<Brick> = {}) {
    for (const [a, b] of ranges) if (b >= a) this.run(a, b, y, z, d, color, opts)
  }

  // Paints one layer from a per-cell colour list (null = empty), grouping equal neighbours into bricks.
  paint(x0: number, cells: (string | null)[], y: number, z: number, d: number, opts: Partial<Brick> = {}) {
    let i = 0
    while (i < cells.length) {
      const col = cells[i]
      let j = i
      while (j + 1 < cells.length && cells[j + 1] === col) j++
      if (col) this.run(x0 + i, x0 + j, y, z, d, col, opts)
      i = j + 1
    }
  }
}

// Subtracts holes from a filled span, returning inclusive ranges.
export function span(from: number, to: number, holes: [number, number][] = []): [number, number][] {
  const out: [number, number][] = []
  let cur = from
  for (const [a, b] of [...holes].sort((p, q) => p[0] - q[0])) {
    if (a > cur) out.push([cur, Math.min(a - 1, to)])
    cur = Math.max(cur, b + 1)
  }
  if (cur <= to) out.push([cur, to])
  return out
}
