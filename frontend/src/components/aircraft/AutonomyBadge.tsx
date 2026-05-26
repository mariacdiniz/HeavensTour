import { AUTONOMY_LABELS } from '@/data/constants'
import type { AutonomyCategory } from '@/types/aircraft'
import { cn } from '@/lib/utils'

export function AutonomyBadge({
  category,
  className,
}: {
  category: AutonomyCategory
  className?: string
}) {
  const config = AUTONOMY_LABELS[category]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className,
      )}
      title={config.description}
    >
      {config.label}
    </span>
  )
}
