import { SITE } from '../site.config';

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(SITE.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** "Mar 2024" — used for compact list rows. */
export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat(SITE.locale, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);
