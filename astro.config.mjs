import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://photography.timothyblake.com',
  prefetch: true,
  integrations: [sitemap()],
});
