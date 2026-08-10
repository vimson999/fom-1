import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: 'Mistria Guide',
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#fbf6e9',
    theme_color: '#173e31',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ]
  };
}
