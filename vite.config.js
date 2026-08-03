import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation': ['framer-motion'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    // `vite preview` inherits server.open unless told otherwise
    // (resolvePreviewOptions: `open: preview?.open ?? server.open`), so every
    // preview of a production build was asking Windows to launch a browser.
    // That is right for `npm run dev`, which you start deliberately, and wrong
    // for preview, which gets run repeatedly in scripts and checks.
    open: false,
  },
});
