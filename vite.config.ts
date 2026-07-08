import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { seoPlugin } from './scripts/seoPlugin'

export default defineConfig({
  plugins: [react(), tailwindcss(), seoPlugin()],
  build: {
    rollupOptions: {
      output: {
        // Split the heavy 3D stack into cohesive vendor chunks. Each library
        // changes at its own cadence, so isolating them lets the browser cache
        // the stable ones (three core, react) across deploys and download all
        // of them in parallel on slow networks instead of as one monolith. The
        // string-array form left an empty `react` chunk (react-dom leaked into
        // the shell); the id-based function form below places each package
        // deterministically and keeps every chunk under the 500 kB warning
        // except three's own core.
        manualChunks(id) {
          // Vite's __vitePreload helper is a virtual module. Left to Rollup it
          // gets parked in whichever vendor chunk happens to use it (drei), and
          // because the entry calls it to lazy-load the city, the entry then
          // statically drags that whole 230 kB chunk onto the critical path.
          // Pin it to `react` — a chunk the shell already loads — so it's free.
          if (id.includes('preload-helper')) return 'react'
          if (!id.includes('node_modules')) return
          // three core — large but stable; rarely changes between deploys.
          if (id.includes('/three/')) return 'three'
          // Post-processing (Bloom) — both the pmndrs lib and its r3f binding.
          // Only used inside the lazy city, so this is pure caching hygiene.
          if (id.includes('postprocessing')) return 'postprocessing'
          // drei helpers + three-stdlib loaders — the bulk of the old r3f chunk.
          if (id.includes('@react-three/drei') || id.includes('three-stdlib')) return 'drei'
          // The r3f reconciler itself — small and paired with three.
          if (id.includes('@react-three/fiber')) return 'r3f'
          // react + react-dom + scheduler — the shell's runtime, cached across
          // deploys. Matching react-dom/scheduler here stops the leak into the
          // app chunk that previously emptied this bundle.
          if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/')) return 'react'
        },
      },
    },
  },
})
