import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/linkedinformat/',  // Match the exact case of the GitHub repository
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
