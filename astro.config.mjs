// @ts-check
import { defineConfig } from 'astro/config';
import path from 'path';
import { fileURLToPath } from 'url';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@core-webApp': path.resolve(__dirname, 'src/core-webApp'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@site-package': path.resolve(__dirname, 'src/site-package'),
      },
    },
    ssr: {
      noExternal: ['react-icons']
    }
  },

  adapter: cloudflare()
});

/**
 * 这是一次测试，测试仓库的变化
 */