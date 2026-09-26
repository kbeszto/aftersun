/**
 * Everything about *you*. Start here.
 * Changing these values updates the whole site — nav, titles, RSS, footer.
 */
export const SITE = {
  /** Used for RSS, sitemap and canonical links. Change this if you add a custom domain. */
  url: 'https://kobepickled.pages.dev',
  title: 'kobepickled',
  /** Shown under the title on the homepage. */
  tagline: 'Thoughts, things I watched, things I listened to, things I saw.',
  description: 'A personal log: thoughts, film and TV notes, music, photos.',
  author: 'Kobe Szeto',
  /** Affects date formatting across the site. */
  locale: 'en-US',
  /** Shown in the footer. Delete any you do not want. */
  links: [
    { label: 'GitHub', href: 'https://github.com/kbeszto' },
    { label: 'RSS', href: '/rss.xml' },
  ],
} as const;
