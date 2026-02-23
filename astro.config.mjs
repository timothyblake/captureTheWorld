import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://capturetheworld.co.uk',
  prefetch: true,
  integrations: [sitemap()],
});
