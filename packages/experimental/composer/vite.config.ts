//
// Copyright 2022 DXOS.org
//

import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { themePlugin } from '@dxos/react-ui/plugin';
import { dxosPlugin } from '@dxos/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig((env) => ({
  base: '', // Ensures relative path to assets.
  optimizeDeps: {
    force: true,
    include: [
      '@lexical/yjs',
      '@dxos/client',
      '@dxos/credentials',
      '@dxos/react-client',
      '@dxos/text-model',
      '@dxos/react-ui'
    ]
  },
  build: {
    outDir: 'out/experimental/app/text-editor',
    commonjsOptions: {
      include: [/packages/, /node_modules/]
    }
  },
  plugins: [
    dxosPlugin(__dirname),
    react(),
    themePlugin({
      content: [
        resolve(__dirname, './index.html'),
        resolve(__dirname, './src/**/*.{js,ts,jsx,tsx}')
      ]
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 30000000
      },
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'DXOS UI composer experiment',
        short_name: 'UI test',
        description: 'DXOS UI composer experiment',
        theme_color: '#ffffff'
      }
    })
  ]
}));