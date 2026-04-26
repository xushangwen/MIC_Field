import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        proposal: './proposal.html',
      },
    },
  },
  server: {
    open: '/proposal.html',
    port: 5173,
  },
})
