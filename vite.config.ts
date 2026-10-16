import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
  const basePath = process.env.VITE_BASE_PATH || '/';

  const buildOptions = {
    sourcemap: mode !== 'production',
    cssMinify: 'lightningcss' as const,
    chunkSizeWarningLimit: 1000,
    minify: 'oxc' as const,
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

  if (mode === 'production') {
    Object.assign(buildOptions, { manifest: true });
  }

  return {
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
        '@': resolve(import.meta.dirname, 'src'),
      },
    },
    base: basePath,
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
