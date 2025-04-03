import { defineConfig } from 'vite';
import { resolve } from 'path';

// Force specific minifier settings to prevent terser usage
export default defineConfig(({ command, mode }) => {
  // Determine if we're in production build
  const isProd = mode === 'production';
  
  return {
    // Use /system3-website/ base for production (GitHub Pages), but / for development
    base: isProd ? '/system3-website/' : '/',
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
        input: {
          main: resolve(__dirname, 'index.html'),
          education: resolve(__dirname, 'education.html'),
          consultancy: resolve(__dirname, 'consultancy.html'),
          about: resolve(__dirname, 'about.html'),
          contact: resolve(__dirname, 'contact.html'),
        },
        output: {
          // Use a more compatible format for filenames
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          manualChunks: {
            vendor: ['three', 'gsap']
          }
        }
      }
    },
    optimizeDeps: {
      exclude: ['terser'] // Explicitly exclude terser from dependencies
    }
  };
});