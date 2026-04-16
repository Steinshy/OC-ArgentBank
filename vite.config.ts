import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';

/** Same value as Vite `base` — injected for static asset URLs (see `getPublicAssetUrl`) */
export const appPublicBasePath = process.env.VITE_BASE_PATH || '/';

export default defineConfig(({ mode }) => {
  const basePath = appPublicBasePath;

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
    define: {
      __APP_PUBLIC_BASE_PATH__: JSON.stringify(appPublicBasePath),
    },
    oxc: {
      jsx: { runtime: 'automatic' },
    },
    plugins: [
      mode !== 'production' && checker({ typescript: true }),
      react(),
      mode !== 'production' &&
        visualizer({
          open: false,
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
    base: basePath,
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
