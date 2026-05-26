import heroImage from '@/assets/photo-1594937113195-27f8b9046013.jpg'
import aboutImage from '@/assets/photo-1760279472704-9a76a3a1bb3c.jpg'

/** Imagens importadas de src/assets — o Vite gera a URL correta no build/dev */
export const MEDIA = {
  heroAirport: heroImage,
  heroRunway:
    'https://images.unsplash.com/photo-1556388150-d0742dbb036a?w=1920&q=85&auto=format',
  aboutHangar: aboutImage,
  serviceFleet:
    'https://images.unsplash.com/photo-1464033890889-9f00f3108229?w=800&q=80&auto=format',
} as const
