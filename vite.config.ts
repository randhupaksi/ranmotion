import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Writes the license of every dependency bundled into the site to the output root, where it is
    // served as /THIRD_PARTY_NOTICES.txt and linked from the footer.
    license: { fileName: 'THIRD_PARTY_NOTICES.txt' },
    rolldownOptions: {
      // Keep `@license` / `/*!` notices in minified output. The GSAP license forbids removing its
      // proprietary notices, and other dependencies ask for their copyright lines to be kept.
      output: { comments: { legal: true } },
    },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    clearMocks: true,
  },
})
