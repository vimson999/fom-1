const productionOrigin = 'https://fieldsofmistria.land';

export const SITE_ORIGIN = new URL(productionOrigin);

if (SITE_ORIGIN.protocol !== 'https:' || SITE_ORIGIN.origin !== productionOrigin) {
  throw new Error('SITE_ORIGIN must be the canonical HTTPS production origin');
}

export const absoluteUrl = (path: string) => new URL(path, SITE_ORIGIN).toString();

export const site = {
  name: 'Fields of Mistria Guide',
  description: 'A curated independent fan guide hub for Fields of Mistria, with source-based guides and item references.',
  keywords: 'Fields of Mistria, Steam, wiki, guide, romance, gifts, farm layout, shovel, fishing',
  officialLinks: {
    website: 'https://www.fieldsofmistria.com/', steam: 'https://store.steampowered.com/app/2142790/Fields_of_Mistria/', discord: 'https://discord.gg/fieldsofmistria', youtube: 'https://www.youtube.com/watch?v=0hW64R15-qI'
  },
  languages: [{ code: 'en', label: 'English', active: true }],
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Guides', href: '/guides' },
    { label: 'Items', href: '/database/items' },
    { label: 'Tools', href: '/#tools' }
  ]
};
