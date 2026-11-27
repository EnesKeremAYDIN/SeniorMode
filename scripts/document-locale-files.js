import { readdirSync, readFileSync } from 'node:fs';

const folder = new URL('./readme-locales/', import.meta.url);

export const readmeLocaleFiles = Object.fromEntries(
  readdirSync(folder).filter(name => name.endsWith('.json')).sort().map(name => {
    const locale = name.slice(0, -'.json'.length);
    if (Intl.getCanonicalLocales(locale)[0] !== locale) {
      throw new Error('Use a canonical language tag for ' + name);
    }
    return [locale, JSON.parse(readFileSync(new URL(name, folder), 'utf8'))];
  }),
);

export function readmeLocaleSection(section) {
  return Object.fromEntries(Object.entries(readmeLocaleFiles).map(([locale, copy]) => {
    if (!copy[section]) throw new Error(locale + ': missing README translation section ' + section);
    return [locale, copy[section]];
  }));
}
