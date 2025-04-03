import { defineConfig } from 'vite';
import { resolve } from 'path';

// Force specific minifier settings to prevent terser usage
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: true,
    open: true,
    allowedHosts: [
      '9b57-2402-e280-2302-de-3ceb-f4b3-c5ff-57c6.ngrok-free.app'
    ]
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild', // Use esbuild instead of terser
    sourcemap: false,
    // Explicitly disable terser
    terserOptions: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['three', 'gsap']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['terser'] // Explicitly exclude terser from dependencies
  }
});