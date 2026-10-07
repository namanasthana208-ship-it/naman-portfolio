// Saves the latest Letterboxd diary to public/letterboxd.json at build time.
// The site falls back to this file if the live /api/letterboxd request fails.
import { writeFile } from 'node:fs/promises'

try {
  const { getLetterboxd } = await import('../api/_letterboxd.ts')
  const watches = await getLetterboxd()
  if (watches.length) {
    await writeFile('public/letterboxd.json', JSON.stringify(watches, null, 2))
    console.log(`letterboxd snapshot: ${watches.length} films`)
  }
} catch (e) {
  console.warn('letterboxd snapshot skipped:', e.message)
}
