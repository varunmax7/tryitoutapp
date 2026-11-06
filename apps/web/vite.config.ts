import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// Manifest per implementation.md §15 Phase 1 task 4. Icons are the Phase 0 placeholder
// AppMark SVG; Phase 1 replaces them with the PNG set exported from the AppMark component.
const manifest = {
  name: 'Tryitout',
  short_name: 'Tryitout',
  description: 'Your real size in every brand, and a fit check on your own body before you buy.',
  start_url: '/',
  scope: '/',
  display: 'standalone' as const,
  orientation: 'portrait' as const,
  theme_color: '#0E1726',
  background_color: '#F6F7F9',
  lang: 'en-IN',
  categories: ['shopping', 'lifestyle'],
  icons: [
    { src: '/icons/appmark.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' as const },
    {
      src: '/icons/appmark-maskable.svg',
      sizes: 'any',
      type: 'image/svg+xml',
      purpose: 'maskable' as const,
    },
  ],
  share_target: {
    action: '/check',
    method: 'GET' as const,
    enctype: 'application/x-www-form-urlencoded',
    params: { title: 'title', text: 'text', url: 'url' },
  },
};

const pkg = JSON.parse(
  readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf8'),
) as { version: string };

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(`tryitout-web@${pkg.version}`),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      manifest,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/v\//, /^\/admin/],
        cleanupOutdatedCaches: true,
      },
      devOptions: { enabled: false },
    }),
  ],
  build: {
    target: 'es2023',
    sourcemap: true,
  },
  server: {
    port: 5173,
  },
});
