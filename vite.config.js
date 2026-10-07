import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base './' guarantees relative assets work on GitHub Pages whether on
  // custom domain (zdjeciakrzysia.pl) or github.io subfolder (username.github.io/repo/)
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
});
