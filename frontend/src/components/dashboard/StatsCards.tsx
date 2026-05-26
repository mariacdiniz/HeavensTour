import { TrendingUp } from 'lucide-react'
import type { ReportDashboard } from '@/types/reports'
import { Card } from '@/components/ui/card'
import { formatNumber } from '@/utils/format'

interface StatsCardsProps {
  data: ReportDashboard
  totalAircraft: number
  longRangeCount: number
}

export function StatsCards({ data, totalAircraft, longRangeCount }: StatsCardsProps) {
  const cards = [
    { label: 'Total de aeronaves', value: totalAircraft },
    { label: 'Não vendidas', value: data.naoVendidas },
    { label: 'Cadastradas na semana', value: data.ultimaSemana },
    { label: 'Autonomia longa', value: longRangeCount },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value }) => (
        <Card key={label} className="p-6">
          <div className="mb-2 text-xs text-muted-foreground">{label}</div>
          <div className="text-3xl font-medium tabular-nums">{formatNumber(value)}</div>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="size-3" />
            <span>Dados em tempo real</span>
          </div>
        </Card>
      ))}
    </div>
  )
}
