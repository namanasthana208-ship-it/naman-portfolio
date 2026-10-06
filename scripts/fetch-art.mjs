// Pulls cover art from the public iTunes Search API into public/art.
// Run: node scripts/fetch-art.mjs
import { writeFile, mkdir } from 'node:fs/promises'

const items = [
  ['album-dsotm', 'pink floyd dark side of the moon', 'music', 'album'],
  ['album-morning-glory', "oasis what's the story morning glory", 'music', 'album'],
  ['album-new-abnormal', 'the strokes the new abnormal', 'music', 'album'],
  ['album-wywh', 'pink floyd wish you were here', 'music', 'album'],
  ['film-swades', 'swades', 'movie', 'movie'],
  ['film-rotk', 'lord of the rings return of the king', 'movie', 'movie'],
  ['film-bttf', 'back to the future', 'movie', 'movie'],
  ['film-batman', 'the batman 2022', 'movie', 'movie'],
  ['film-starwars', 'star wars a new hope', 'movie', 'movie'],
  ['film-about-time', 'about time', 'movie', 'movie'],
  ['film-piku', 'piku', 'movie', 'movie'],
  ['tv-office', 'the office', 'tvShow', 'tvSeason'],
  ['tv-house', 'house m.d.', 'tvShow', 'tvSeason'],
  ['tv-atla', 'avatar the last airbender', 'tvShow', 'tvSeason'],
  ['tv-doctor-who', 'doctor who', 'tvShow', 'tvSeason'],
  ['tv-lanterns', 'lanterns', 'tvShow', 'tvSeason'],
  ['tv-severance', 'severance', 'tvShow', 'tvSeason'],
  ['comic-all-star-superman', 'all-star superman', 'ebook', 'ebook'],
  ['comic-court-of-owls', 'batman the court of owls', 'ebook', 'ebook'],
  ['comic-gl-rebirth', 'green lantern rebirth', 'ebook', 'ebook'],
  ['comic-bleach', 'bleach vol. 1', 'ebook', 'ebook'],
  ['comic-aot', 'attack on titan vol. 1', 'ebook', 'ebook'],
  ['comic-ultimate-spidey', 'ultimate spider-man vol. 1 power and responsibility', 'ebook', 'ebook'],
  ['comic-year-one', 'batman year one', 'ebook', 'ebook'],
  ['comic-long-halloween', 'batman the long halloween', 'ebook', 'ebook'],
  ['comic-for-all-seasons', 'superman for all seasons', 'ebook', 'ebook'],
  ['comic-emerald-twilight', 'green lantern emerald twilight', 'ebook', 'ebook'],
]

const only = process.argv.slice(2)
await mkdir('public/art', { recursive: true })

for (const [slug, term, media, entity] of items) {
  if (only.length && !only.includes(slug)) continue
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=${media}&entity=${entity}&limit=5&country=us`
  const res = await fetch(url)
  const json = await res.json()
  const hit = json.results?.[0]
  if (!hit?.artworkUrl100) {
    console.log(`MISS ${slug}`)
    continue
  }
  const art = hit.artworkUrl100.replace(/\/\d+x\d+bb\./, '/600x600bb.')
  const img = Buffer.from(await (await fetch(art)).arrayBuffer())
  await writeFile(`public/art/${slug}.jpg`, img)
  console.log(`ok   ${slug} <- ${hit.collectionName || hit.trackName} (${hit.artistName})`)
}
