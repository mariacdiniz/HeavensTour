import { cn } from '@/lib/utils'

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'size-5 animate-spin rounded-full border-2 border-white/20 border-t-cockpit',
        className,
      )}
      role="status"
      aria-label="Carregando"
    />
  )
}
