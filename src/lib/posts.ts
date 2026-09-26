import { getCollection } from 'astro:content';
import { SECTIONS, getSection, type Section, type SectionId } from './sections';

/** Drafts are visible while running `npm run dev`, hidden in the built site. */
const isVisible = (entry: { data: { draft?: boolean } }) =>
  import.meta.env.DEV || !entry.data.draft;

/**
 * A single, uniform shape for anything that can appear in a list — no matter
 * which section it came from. Components only ever deal with this.
 */
export interface FeedItem {
  id: string;
  section: Section;
  href: string;
  title: string;
  date: Date;
  summary?: string;
  tags: string[];
  rating?: number;
  /** Short credit line, e.g. "Dir. Denis Villeneuve · 2024". */
  meta?: string;
  /** The raw collection entry, if a page needs section-specific fields. */
  entry: any;
}

/** The little grey line under a title. Tweak per section to taste. */
function metaLine(sectionId: SectionId, data: any): string | undefined {
  const parts: (string | undefined)[] = [];
  switch (sectionId) {
    case 'movies':
      parts.push(data.director ? `Dir. ${data.director}` : undefined, data.year?.toString());
      break;
    case 'tv':
      parts.push(data.season, data.creator, data.year?.toString());
      break;
    case 'music':
      parts.push(data.artist, data.year?.toString(), data.format);
      break;
    case 'photos':
      parts.push(data.location, data.images?.length ? `${data.images.length} photos` : undefined);
      break;
  }
  const line = parts.filter(Boolean).join(' · ');
  return line || undefined;
}

function toFeedItem(sectionId: SectionId, entry: any): FeedItem {
  const section = getSection(sectionId)!;
  return {
    id: entry.id,
    section,
    href: `/${section.slug}/${entry.id}/`,
    title: entry.data.title,
    date: entry.data.date,
    summary: entry.data.summary,
    tags: entry.data.tags ?? [],
    rating: entry.data.rating,
    meta: metaLine(sectionId, entry.data),
    entry,
  };
}

const newestFirst = (a: FeedItem, b: FeedItem) => b.date.valueOf() - a.date.valueOf();

/** Everything in one section, newest first. */
export async function getSectionItems(sectionId: SectionId): Promise<FeedItem[]> {
  const entries = await getCollection(sectionId, isVisible);
  return entries.map((e: any) => toFeedItem(sectionId, e)).sort(newestFirst);
}

/** Every entry on the site, newest first — this is the homepage feed. */
export async function getAllItems(): Promise<FeedItem[]> {
  const lists = await Promise.all(SECTIONS.map((s) => getSectionItems(s.id)));
  return lists.flat().sort(newestFirst);
}

/** Tag -> count, most used first. */
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const counts = new Map<string, number>();
  for (const item of await getAllItems()) {
    for (const tag of item.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
