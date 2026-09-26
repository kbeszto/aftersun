/**
 * The sections of the site. Each one maps 1:1 to a content collection
 * in `src/content.config.ts` and a folder in `src/content/`.
 *
 * To add a section: add a collection in content.config.ts, a folder in
 * src/content/, and an entry here. Routing, nav, the homepage feed and
 * RSS all pick it up automatically.
 */
export type SectionId = 'thoughts' | 'movies' | 'tv' | 'music' | 'photos';

export interface Section {
  id: SectionId;
  /** URL segment, e.g. /movies */
  slug: string;
  /** Plural label, used in nav and index pages. */
  label: string;
  /** Singular label, used in meta lines. */
  singular: string;
  /** Shown at the top of the section's index page. */
  blurb: string;
  /** Set false to hide from the top nav (still reachable by URL). */
  inNav: boolean;
}

export const SECTIONS: Section[] = [
  {
    id: 'thoughts',
    slug: 'thoughts',
    label: 'Thoughts',
    singular: 'Thought',
    blurb: 'Whatever is on my mind.',
    inNav: true,
  },
  {
    id: 'movies',
    slug: 'movies',
    label: 'Movies',
    singular: 'Movie',
    blurb: 'Films I watched, and what I made of them.',
    inNav: true,
  },
  {
    id: 'tv',
    slug: 'tv',
    label: 'TV',
    singular: 'Show',
    blurb: 'Series notes, season by season.',
    inNav: true,
  },
  {
    id: 'music',
    slug: 'music',
    label: 'Music',
    singular: 'Record',
    blurb: 'Albums on repeat.',
    inNav: true,
  },
  {
    id: 'photos',
    slug: 'photos',
    label: 'Photos',
    singular: 'Roll',
    blurb: 'Things I pointed a camera at.',
    inNav: true,
  },
];

export const NAV = SECTIONS.filter((s) => s.inNav);

export function getSection(id: string): Section | undefined {
  return SECTIONS.find((s) => s.id === id || s.slug === id);
}
