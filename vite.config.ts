import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { seoPlugin } from './scripts/seoPlugin'

export default defineConfig({
  plugins: [react(), tailwindcss(), seoPlugin()],
  build: {
    rollupOptions: {
      output: {
        // Split the heavy 3D stack from app code: three.js changes rarely, so
        // it caches independently, and the chunks download in parallel on
        // slow networks instead of as one monolith.
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
})
