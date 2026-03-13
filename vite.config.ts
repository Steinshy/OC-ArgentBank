import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

const vitePWA = VitePWA({
  registerType: 'autoUpdate',
  includeAssets: [],
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff,woff2}'],
    globIgnores: ['**/assets/background_*.jpg'],
    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
    cleanupOutdatedCaches: true,
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365,
          },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'gstatic-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365,
          },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          },
        },
      },
      {
        urlPattern: /\.(?:js|css)$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-resources',
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 60 * 60 * 24 * 7,
          },
        },
      },
    ],
  },
  devOptions: { enabled: false, type: 'module' },
});

export default defineConfig(({ mode }) => {
  // Common Build Options
  const buildOptions = {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    cssCodeSplit: true,
    cssMinify: 'esbuild' as const,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild' as const,
    reportCompressedSize: true,
    modulePreload: {
        polyfill: true,
      },
  };

  // Development Mode
  if (mode === 'development') {
    Object.assign({
      host: 'localhost',
      port: 5173,
    });
  }

  // Production Mode
  if (mode === 'production') {
    Object.assign(buildOptions, {
      sourcemap: false,
      manifest: true,
    });
  }

  return {
    plugins: [
      checker({ typescript: true }),
      tsconfigPaths(),
      react(),
      vitePWA,
    ],
    base: process.env.VITE_BASE_PATH || '/',
    publicDir: './public',
    build: buildOptions,
    optimizeDeps: {
      include: ['lucide-react', 'react', 'react-dom', 'react-router'],
    },
    preview: {
      host: 'localhost',
      port: 3000,
    },
  };
});
