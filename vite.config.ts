import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { getLetterboxd } from './api/_letterboxd'

// Serves /api/letterboxd locally the same way the Vercel function does in production.
const letterboxdDev = (): Plugin => ({
  name: 'letterboxd-dev',
  configureServer(server) {
    server.middlewares.use('/api/letterboxd', async (_req, res) => {
      res.setHeader('Content-Type', 'application/json')
      try {
        res.end(JSON.stringify(await getLetterboxd()))
      } catch {
        res.statusCode = 502
        res.end('[]')
      }
    })
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), letterboxdDev()],
})
