import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'THE INKSPIRE - Digital Magazine',
    short_name: 'Inkspire',
    description: 'A premium digital sanctuary for Islamic literature',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F0F0F',
    theme_color: '#2E5BFF',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
