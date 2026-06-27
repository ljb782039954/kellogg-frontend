// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [react()],

  // vite: {
  //   plugins: [tailwindcss()]
  // },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // Force Vite to bundle react-icons on SSR
      noExternal: ['react-icons']
    }
  },

  adapter: cloudflare()
});

/**
 * 这是一次测试，测试仓库的变化
 */