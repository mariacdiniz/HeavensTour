import type { AutonomyCategory } from '@/types/aircraft'

export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'HeavensTour'

export const MANUFACTURERS = [
  'Airbus',
  'Boeing',
  'Bombardier',
  'Embraer',
  'Lockheed Martin',
] as const

export const AUTONOMY_LABELS: Record<
  AutonomyCategory,
  { label: string; description: string; className: string }
> = {
  Curta: {
    label: 'Curta',
    description: 'até 3.000 km',
    className:
      'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  Média: {
    label: 'Média',
    description: '3.000 – 7.000 km',
    className:
      'border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent)]',
  },
  Longa: {
    label: 'Longa',
    description: 'acima de 7.000 km',
    className:
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
}

export const DEMO_CREDENTIALS = {
  admin: { email: 'admin@heavenstour.com', password: 'admin123' },
  user: { email: 'user@heavenstour.com', password: 'user123' },
} as const
