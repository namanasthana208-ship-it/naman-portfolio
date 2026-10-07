export type Watch = {
  title: string
  year: string
  rating: number | null
  liked: boolean
  rewatch: boolean
  watched: string
  poster: string | null
  review: string | null
  link: string
}

const FEED = 'https://letterboxd.com/namanasthana/rss/'

const tag = (item: string, name: string) =>
  item.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1]?.trim() ?? ''

const decode = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")

export async function getLetterboxd(limit = 6): Promise<Watch[]> {
  const res = await fetch(FEED, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
      Accept: 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  })
  if (!res.ok) throw new Error(`letterboxd ${res.status}`)
  const xml = await res.text()
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? []

  return items
    .filter((item) => item.includes('<letterboxd:filmTitle>'))
    .slice(0, limit)
    .map((item) => {
      const desc = tag(item, 'description').replace(/^<!\[CDATA\[|\]\]>$/g, '')
      const paras = [...desc.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1].trim())
      const text = paras
        .filter((p) => !p.startsWith('<img') && !/^Watched on /.test(p))
        .map((p) => decode(p.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '')))
        .join('\n')
        .trim()
      const rating = tag(item, 'letterboxd:memberRating')
      return {
        title: decode(tag(item, 'letterboxd:filmTitle')),
        year: tag(item, 'letterboxd:filmYear'),
        rating: rating ? Number(rating) : null,
        liked: tag(item, 'letterboxd:memberLike') === 'Yes',
        rewatch: tag(item, 'letterboxd:rewatch') === 'Yes',
        watched: tag(item, 'letterboxd:watchedDate'),
        poster: desc.match(/<img src="([^"]+)"/)?.[1] ?? null,
        review: text || null,
        link: tag(item, 'link'),
      }
    })
}
