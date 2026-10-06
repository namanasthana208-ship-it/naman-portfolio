// Pulls film posters, album sleeves and TV key art from Wikipedia infoboxes into public/art.
// Run: node scripts/fetch-wiki-art.mjs [slug ...]
import { writeFile, mkdir } from 'node:fs/promises'

const UA = { 'User-Agent': 'portfolio-build/1.0 (namanasthana208@gmail.com)' }
const items = [
  ['album-dsotm', 'The Dark Side of the Moon'],
  ['album-new-abnormal', 'The New Abnormal'],
  ['film-swades', 'Swades'],
  ['film-rotk', 'The Lord of the Rings: The Return of the King'],
  ['film-bttf', 'Back to the Future'],
  ['film-batman', 'The Batman (film)'],
  ['film-starwars', 'Star Wars (film)'],
  ['film-about-time', 'About Time (2013 film)'],
  ['film-piku', 'Piku'],
  ['tv-office', 'The Office (American TV series)'],
  ['tv-house', 'House (TV series)'],
  ['tv-atla', 'Avatar: The Last Airbender'],
  ['tv-doctor-who', 'Doctor Who'],
  ['tv-lanterns', 'Lanterns (TV series)'],
  ['tv-severance', 'Severance (TV series)'],
  ['film-superman-2025', 'Superman (2025 film)'],
  ['crest-barca', 'FC Barcelona'],
]

const api = (params) =>
  fetch('https://en.wikipedia.org/w/api.php?format=json&formatversion=2&' + new URLSearchParams(params), { headers: UA }).then((r) => r.json())

const only = process.argv.slice(2)
await mkdir('public/art', { recursive: true })

for (const [slug, title] of items) {
  if (only.length && !only.includes(slug)) continue
  const parsed = await api({ action: 'parse', page: title, prop: 'wikitext', section: '0', redirects: '1' })
  const text = parsed.parse?.wikitext ?? ''
  const m = text.match(/\|\s*(?:image|cover|poster)\s*=\s*(?:\[\[)?(?:File:|Image:)?([^|\]\n]+\.(?:jpe?g|png|webp|gif))/i)
  if (!m) {
    console.log(`MISS ${slug} (no infobox image)`)
    continue
  }
  const file = m[1].trim()
  const info = await api({ action: 'query', titles: `File:${file}`, prop: 'imageinfo', iiprop: 'url', iiurlwidth: '600' })
  const ii = info.query?.pages?.[0]?.imageinfo?.[0]
  const src = ii?.thumburl || ii?.url
  if (!src) {
    console.log(`MISS ${slug} (no url for ${file})`)
    continue
  }
  const img = Buffer.from(await (await fetch(src, { headers: UA })).arrayBuffer())
  const ext = src.match(/\.(png|jpe?g|webp|gif)(?:$|\?)/i)?.[1]?.toLowerCase().replace('jpeg', 'jpg') ?? 'jpg'
  await writeFile(`public/art/${slug}.${ext}`, img)
  console.log(`ok   ${slug} <- ${file}`)
}
