import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { ReportDashboard } from '@/types/reports'
import { Card } from '@/components/ui/card'
import { formatNumber } from '@/utils/format'

interface ReportChartsProps {
  data: ReportDashboard
  totalAircraft: number
}

export function ReportCharts({ data, totalAircraft }: ReportChartsProps) {
  const decadeData = data.porDecada.map((d) => ({
    decada: `${d.decada}s`,
    quantidade: d.quantidade,
  }))

  const maxFab = Math.max(...data.porFabricante.map((f) => f.quantidade), 1)

  return (
    <div id="relatorios" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h3 className="mb-6 font-medium">Aeronaves por década</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={decadeData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="decada" className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
            <YAxis className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
              formatter={(value) => [`${value ?? 0} aeronaves`, 'Quantidade']}
            />
            <Bar
              dataKey="quantidade"
              fill="var(--chart-1)"
              radius={[4, 4, 0, 0]}
              activeBar={false}
              cursor="default"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="mb-6 font-medium">Aeronaves por fabricante</h3>
        <div className="mt-4 space-y-4">
          {data.porFabricante.map((item) => (
            <div key={item.fabricante}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>{item.fabricante}</span>
                <span className="text-muted-foreground">{item.quantidade}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${(item.quantidade / maxFab) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
          {data.porFabricante.length === 0 && (
            <p className="text-sm text-muted-foreground">Sem dados de fabricante.</p>
          )}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Frota total: {formatNumber(totalAircraft)} aeronaves cadastradas
        </p>
      </Card>
    </div>
  )
}
