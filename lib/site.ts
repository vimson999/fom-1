export const site = {
  name: 'Fields of Mistria Wiki',
  description: 'Complete Fields of Mistria guide database. Find romance gift lists, shovel locations, fish schedules, and farm layout ideas to rebuild your farm.',
  keywords: 'Fields of Mistria, Steam, wiki, guide, romance, gifts, farm layout, shovel, fishing',
  officialLinks: {
    website: 'https://www.fieldsofmistria.com/', steam: 'https://store.steampowered.com/app/2142790/Fields_of_Mistria/', discord: 'https://discord.gg/fieldsofmistria', youtube: 'https://www.youtube.com/watch?v=0hW64R15-qI'
  },
  languages: [{ code: 'en', label: 'English', active: true }, { code: 'ja', label: '日本語', active: false }, { code: 'de', label: 'Deutsch', active: false }, { code: 'es', label: 'Español', active: false }],
  navigation: [
    { label: 'Database', href: '/database/items' },
    { label: 'Items', href: '/database/items' },
    { label: 'Guides', href: '/guides' },
    { label: 'Tools', href: '/#tools' }
  ]
};
