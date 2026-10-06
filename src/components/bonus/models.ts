// Small brick models for the bonus sets. Each step number is a build phase.
// Colours are kept light enough to read on the dark display-case cards.
import { Builder, span, type Brick } from '../../brick/engine'

// a wood-panelled retro TV with knobs and rabbit ears
export function tv(): Brick[] {
  const b = new Builder()
  b.add(2, 0, 0, 1, 3, 'brown')
  b.add(13, 0, 0, 1, 3, 'brown')
  b.step = 1
  for (let z = 1; z <= 11; z++) {
    const wood = z === 1 || z === 11 ? 'sandDark' : 'redBrown'
    if (z >= 3 && z <= 9) {
      b.rows(span(0, 15, [[2, 11]]), 0, z, 4, wood)
      b.add(2, 3, z, 10, 1, 'black', { studs: false })
    } else b.run(0, 15, 0, z, 4, z === 2 || z === 10 ? 'peach' : wood)
  }
  b.step = 2
  b.add(13, -1, 8, 1, 1, 'cream')
  b.add(13, -1, 5, 1, 1, 'gold')
  for (let z = 12; z <= 14; z++) {
    b.round(4, 1, z, 1, 'grey', { studs: false })
    b.round(11, 1, z, 1, 'grey', { studs: false })
  }
  b.round(3.8, 0.8, 15, 1.4, 'red', { h: 0.8, studs: false })
  b.round(10.8, 0.8, 15, 1.4, 'red', { h: 0.8, studs: false })
  return b.bricks
}

// a rangefinder: silver top and bottom, tan leather, big lens
export function camera(): Brick[] {
  const b = new Builder()
  for (let z = 0; z <= 7; z++) b.run(0, 13, 0, z, 4, z === 0 || z >= 6 ? 'white' : 'sandDark')
  b.step = 1
  b.add(1, 1, 8, 4, 2, 'grey')
  b.round(10, 1, 8, 2, 'red', { h: 0.7, studs: false })
  b.add(11, -1, 5, 2, 1, 'cream')
  b.step = 2
  for (let z = 1; z <= 6; z++) b.add(4, -2, z, 6, 2, z === 1 || z === 6 ? 'grey' : 'darkGrey')
  b.add(5, -3, 2, 4, 1, 'navy', { studs: false })
  b.add(5, -3, 3, 4, 1, 'blue', { studs: false })
  b.add(5, -3, 4, 4, 1, 'blue', { studs: false })
  b.add(5, -3, 5, 4, 1, 'navy', { studs: false })
  return b.bricks
}
