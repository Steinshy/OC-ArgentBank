import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const basePath = process.env.VITE_BASE_PATH || '/';
  const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const vitePWA = VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['logo.svg', 'assets/**/*'],
    manifest: {
      name: 'Argent Bank — Financial Dashboard',
      short_name: 'Argent Bank',
      description: 'Modern financial dashboard with account management and transactions',
      categories: ['finance', 'productivity'],
      theme_color: '#282d30',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait-primary',
      scope: normalizedBasePath,
      start_url: normalizedBasePath,
      screenshots: [
        {
          src: `${normalizedBasePath}logo.svg`,
          sizes: '192x192',
          type: 'image/svg+xml',
          form_factor: 'narrow',
        },
      ],
      icons: [
        {
          src: `${normalizedBasePath}logo.svg`,
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any maskable',
        },
      ],
      shortcuts: [
        {
          name: 'View Profile',
          short_name: 'Profile',
          description: 'View your financial profile',
          url: `${normalizedBasePath}profile`,
          icons: [
            {
              src: `${normalizedBasePath}logo.svg`,
              sizes: '192x192',
              type: 'image/svg+xml',
            },
          ],
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff,woff2}'],
      globIgnores: ['**/assets/background_*.jpg', '**/node_modules/**/*'],
      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      navigateFallback: `${normalizedBasePath}index.html`,
      navigateFallbackDenylist: [/^\/api\//, /\.[^/]+\.[^/]+$/],
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
        {
          urlPattern: /^https:\/\/.*\/api\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24,
            },
            networkTimeoutSeconds: 3,
          },
        },
      ],
    },
    devOptions: { enabled: false, type: 'module' },
  });

  const buildOptions = {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: mode === 'production' ? false : true,
    cssCodeSplit: true,
    cssMinify: 'lightningcss' as const,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    minify: 'oxc' as const,
    reportCompressedSize: true,
    modulePreload: {
      polyfill: true,
    },
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'vendor-ui', test: /node_modules[\\/]lucide-react[\\/]/, priority: 4 },
            {
              name: 'vendor-redux',
              test: /node_modules[\\/]@reduxjs[\\/]toolkit[\\/]/,
              priority: 3,
            },
            {
              name: 'vendor-react',
              test: /node_modules[\\/](react|react-dom|react-router|react-redux)[\\/]/,
              priority: 2,
            },
            { name: 'vendor', test: /node_modules[\\/]/, priority: 1 },
          ],
        },
      },
    },
  };

  // Production Mode
  if (mode === 'production') {
    Object.assign(buildOptions, {
      sourcemap: false,
      manifest: true,
    });
  }

  return {
    oxc: {
      jsx: { runtime: 'automatic' },
    },
    plugins: [
      checker({ typescript: true }),
      react(),
      vitePWA,
      mode === 'production' &&
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html',
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    base: normalizedBasePath,
    publicDir: './public',
    build: buildOptions,
    optimizeDeps: {
      include: ['lucide-react', 'react', 'react-dom', 'react-router', '@reduxjs/toolkit', 'react-redux'],
    },
    preview: {
      host: 'localhost',
      port: 3000,
    },
  };
});
