import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getLetterboxd } from './_letterboxd'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const watches = await getLetterboxd()
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400')
    res.status(200).json(watches)
  } catch {
    res.status(502).json([])
  }
}
