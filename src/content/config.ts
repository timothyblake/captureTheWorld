import { defineCollection, z } from 'astro:content';

const albums = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroImage: z.string(),
    thumbnail: z.string().optional(),
    flickrAlbumId: z.string(),
    location: z.string(),
    order: z.number(),
    lat: z.number(),
    lng: z.number(),
    mapZoom: z.number().optional(),
    tags: z.array(z.string()).optional(),
    datePublished: z.string(),
  }),
});

export const collections = { albums };
