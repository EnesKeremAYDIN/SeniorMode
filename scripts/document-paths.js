import { locales } from './document-locales.js';

export const readmeSections = ['install', 'usage', 'examples', 'directory', 'faq'];

const anchors = {
  usage: 'usage', examples: 'examples', directory: 'skill-directory', faq: 'faq',
  integrations: 'cli-mcp', roadmap: 'roadmap', security: 'security',
};

export function readmeAnchor(locale, section) {
  return '#' + (section === 'install' ? locales[locale].installAnchor : anchors[section]);
}

export function readmePath(locale) {
  return locale === 'en' ? 'README.md' : 'docs/i18n/' + locale + '/README.md';
}
