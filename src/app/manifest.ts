import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Connect',
    short_name: 'Connect',
    description: 'Create and share a mobile business card with NFC, QR, and vCard fallbacks.',
    start_url: '/',
    display: 'standalone',
    background_color: '#070806',
    theme_color: '#4df6a2',
    icons: [
      {
        src: '/thumbnail.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/thumbnail.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
