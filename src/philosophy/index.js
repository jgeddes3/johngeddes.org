/* Essay registry. Every file in ./entries that default-exports an essay
   object is picked up automatically — adding an essay to the site is one
   file in ./entries/ (see templates/TemplateEssayEntry.js). Routes and the
   Philosophy page read from here. */
import { CATEGORY_KEYS } from './categoryKeys';

const VALID = new Set(CATEGORY_KEYS.map((c) => c.key));
const modules = import.meta.glob('./entries/*.js', { eager: true });

export const essays = Object.values(modules)
  .map((m) => m.default)
  .filter((e) => {
    if (!e) return false;
    if (!VALID.has(e.category)) {
      console.warn(`Essay "${e.slug}" has unknown category "${e.category}" and was skipped.`);
      return false;
    }
    return true;
  })
  .sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title));

export const essaysIn = (category) => essays.filter((e) => e.category === category);

export const bySlug = (slug) => essays.find((e) => e.slug === slug);

const MONTH_YEAR = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });

/* "2026-11-04" -> "Nov 2026". Noon avoids the date shifting across time zones. */
export const formatDate = (iso) => (iso ? MONTH_YEAR.format(new Date(`${iso}T12:00:00`)) : '');
