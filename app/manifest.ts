import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mock'n'Go - Instant REST API Mock Generator",
    short_name: "Mock'n'Go",
    description: "Create realistic REST API mocks instantly. No configuration, no setup. Perfect for frontend development, testing, and prototyping.",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f97316',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
