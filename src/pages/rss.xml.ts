import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
    const albums = (await getCollection('albums')).sort(
        (a, b) => new Date(b.data.datePublished).getTime() - new Date(a.data.datePublished).getTime()
    );
    return rss({
        title: 'Capture The World – Travel Photography',
        description: 'A travel photography gallery capturing places around the world.',
        site: context.site!.toString(),
        items: albums.map(album => ({
            title: album.data.title,
            description: album.data.description,
            pubDate: new Date(album.data.datePublished),
            link: `/album/${album.id.replace(/\.md$/, '')}`,
        })),
        customData: `<language>en-gb</language>`,
    });
}
