import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://live-chatapi.vercel.app', // Backend URL
        changeOrigin: true,
        secure: false, // Set to true if the backend uses HTTPS with a valid certificate
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Remove '/api' from requests
      },
    },
  },
});
