# Naman Asthana · Portfolio

A personal portfolio styled like a set of brick building instructions.

Built with React, Vite, TypeScript, Tailwind and [Motion](https://motion.dev). Smooth scrolling by Lenis.

## Run it

```bash
npm install
npm run dev
```

## What's where

- `src/content.ts`: all the copy, numbers, albums, films, comics and photos
- `src/components/`: the hero, step pages, parts list and contact
- `src/components/Visuals.tsx`: the interactive work pieces (prediction game, growth bars, DM thread, activation bar)
- `src/components/bonus/`: the dark "display case" bonus section
- `src/brick/engine.ts`: the small isometric brick renderer used for the TV and camera
- `api/letterboxd.ts`: a Vercel function that reads the public Letterboxd RSS feed for the live "last watched" strip
- `scripts/`: one-off scripts that fetched the cover art into `public/art`

Album, film, show and comic artwork belongs to its respective owners and is shown for personal, non-commercial reference.
