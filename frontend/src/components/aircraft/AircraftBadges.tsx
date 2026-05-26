import type { AutonomyCategory } from '@/types/aircraft'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const autonomyStyles: Record<AutonomyCategory, string> = {
  Curta: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  Média: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  Longa: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
}

export function AutonomyBadge({ category }: { category: AutonomyCategory }) {
  return (
    <Badge variant="outline" className={cn(autonomyStyles[category])}>
      {category}
    </Badge>
  )
}

export function StatusBadge({ vendido }: { vendido: boolean }) {
  if (vendido) {
    return (
      <Badge
        variant="outline"
        className="bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
      >
        Vendida
      </Badge>
    )
  }
  return (
    <Badge
      variant="outline"
      className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
    >
      Disponível
    </Badge>
  )
}
