import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Fields every entry has, in every section.
 *
 * `title` and `date` are required; everything else is optional, so you can
 * write a two-line thought without filling out a form.
 */
const base = {
  title: z.string(),
  /** YYYY-MM-DD in frontmatter. */
  date: z.coerce.date(),
  /** One-line teaser shown in lists and RSS. Falls back to nothing. */
  summary: z.string().optional(),
  tags: z.array(z.string()).default([]),
  /** Set `draft: true` to keep it out of the built site. */
  draft: z.boolean().default(false),
};

/** A 0–5 rating, halves allowed: 3.5 is fine. */
const rating = z.number().min(0).max(5).optional();

/** Points the loader at src/content/<dir>/**.md(x) */
const md = (dir: string) => glob({ pattern: '**/*.{md,mdx}', base: `./src/content/${dir}` });

const thoughts = defineCollection({
  loader: md('thoughts'),
  schema: z.object({ ...base }),
});

const movies = defineCollection({
  loader: md('movies'),
  schema: z.object({
    ...base,
    /** Release year of the film. */
    year: z.number().optional(),
    director: z.string().optional(),
    rating,
    rewatch: z.boolean().default(false),
  }),
});

const tv = defineCollection({
  loader: md('tv'),
  schema: z.object({
    ...base,
    year: z.number().optional(),
    creator: z.string().optional(),
    /** e.g. "Season 2" or "S1–S3" */
    season: z.string().optional(),
    rating,
    status: z.enum(['watching', 'finished', 'abandoned']).optional(),
  }),
});

const music = defineCollection({
  loader: md('music'),
  schema: z.object({
    ...base,
    artist: z.string().optional(),
    year: z.number().optional(),
    rating,
    /** e.g. "LP", "streaming", "cassette" */
    format: z.string().optional(),
  }),
});

const photos = defineCollection({
  loader: md('photos'),
  /**
   * Photo files live next to the .md file that uses them and are referenced
   * relatively (e.g. `./roll-01.jpg`). Astro then optimizes them and emits
   * responsive sizes — drop a 6MB phone JPEG in and it handles the rest.
   */
  schema: ({ image }) =>
    z.object({
      ...base,
      location: z.string().optional(),
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string().optional(),
          }),
        )
        .default([]),
    }),
});

export const collections = { thoughts, movies, tv, music, photos };
