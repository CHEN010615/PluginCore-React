import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    electron([{
      entry: 'electron/main/index.ts',
      onstart(options) {
        options.startup();
      },
      vite: {
        build: {
          outDir: 'dist-electron/main',
          rollupOptions: {
            external: ['electron', 'electron-store', 'electron-updater']
          }
        }
      }
    }, {
      entry: 'electron/preload/index.ts',
      onstart(options) {
        options.reload();
      },
        vite: {
          build: {
            outDir: 'dist-electron/preload',
            rollupOptions: {
              external: ['electron']
            },
          },
        }
    }]),
    renderer()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@electron': resolve(__dirname, 'electron')
    }
  },
  server: {
    port: 8100,
  },
  publicDir: 'src/static',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});