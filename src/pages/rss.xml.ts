import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../site.config';
import { getAllItems } from '../lib/posts';

export async function GET(context: APIContext) {
  const items = await getAllItems();

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: items.map((item) => ({
      title: item.title,
      pubDate: item.date,
      description: item.summary ?? item.meta ?? '',
      link: item.href,
      categories: [item.section.label, ...item.tags],
    })),
    customData: `<language>en</language>`,
  });
}
