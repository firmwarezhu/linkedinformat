import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/linkedinformat/' : '/',
  server: {
    host: true, // Listen on all addresses
    port: 5173,
    strictPort: true,
  },
})
