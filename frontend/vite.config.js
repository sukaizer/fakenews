import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'media/video', // Specify the directory to serve static files from
  server: {
    host: '0.0.0.0', // Allow connections from any device on the local network
    strictPort: true, // If the port is already in use, the server will fail to start
  },
});