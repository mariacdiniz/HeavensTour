import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Trash2, TrendingUp } from 'lucide-react'
import { useAircraftList, useReports } from '@/hooks/useAircrafts'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { ReportCharts } from '@/components/dashboard/ReportCharts'
import { AutonomyBadge, StatusBadge } from '@/components/aircraft/AircraftBadges'
import { AircraftDetailModal } from '@/components/aircraft/AircraftDetailModal'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'
import type { Aircraft } from '@/types/aircraft'

export function DashboardPage() {
  const { data, isLoading, isError, refetch } = useReports()
  const { data: listData } = useAircraftList({ page: 1, limit: 5 })
  const { data: longaData } = useAircraftList({
    page: 1,
    limit: 1,
    categoriaAutonomia: 'Longa',
  })
  const { hasRole } = useAuth()
  const [viewing, setViewing] = useState<Aircraft | null>(null)

  const totalAircraft =
    data?.porFabricante.reduce((acc, f) => acc + f.quantidade, 0) ?? listData?.total ?? 0
  const recent = listData?.data ?? []

  return (
    <div className="space-y-8 p-8">
      {isLoading && (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-xl" />
        </div>
      )}

      {isError && (
        <Card className="p-8 text-center text-sm text-destructive">
          Não foi possível carregar os relatórios.{' '}
          <button type="button" onClick={() => refetch()} className="text-primary underline">
            Tentar novamente
          </button>
        </Card>
      )}

      {data && (
        <>
          <StatsCards
            data={data}
            totalAircraft={totalAircraft}
            longRangeCount={longaData?.total ?? 0}
          />
          <ReportCharts data={data} totalAircraft={totalAircraft} />

          <Card className="p-6">
            <h3 className="mb-2 font-medium">Aeronaves recentes</h3>
            <p className="mb-6 text-xs text-muted-foreground">
              Clique em uma linha para ver os detalhes completos.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 text-xs font-medium text-muted-foreground">
                      Código ICAO
                    </th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground">Nome</th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground">
                      Fabricante
                    </th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground">Ano</th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground">
                      Autonomia
                    </th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recent.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                        Nenhuma aeronave cadastrada ainda.
                      </td>
                    </tr>
                  ) : (
                    recent.map((aircraft) => (
                      <tr
                        key={aircraft.id}
                        className="cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/50"
                        onClick={() => setViewing(aircraft)}
                      >
                        <td className="py-4 text-sm font-medium">{aircraft.icaoCode}</td>
                        <td className="py-4 text-sm">{aircraft.nome}</td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {aircraft.marca}
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {aircraft.ano}
                        </td>
                        <td className="py-4">
                          <AutonomyBadge category={aircraft.categoriaAutonomia} />
                        </td>
                        <td className="py-4">
                          <StatusBadge vendido={aircraft.vendido} />
                        </td>
                        <td className="py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="size-8" asChild>
                              <Link
                                to={`/app/aeronaves/${aircraft.id}/editar`}
                                aria-label="Editar"
                              >
                                <Edit className="size-4" />
                              </Link>
                            </Button>
                            {hasRole('admin') && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-destructive hover:text-destructive"
                                asChild
                              >
                                <Link to="/app/aeronaves" aria-label="Gerenciar frota">
                                  <Trash2 className="size-4" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="flex items-center gap-3 border-primary/20 bg-primary/5 p-4">
            <TrendingUp className="size-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              Fabricante com mais aeronaves:{' '}
              <span className="font-medium text-foreground">
                {data.porFabricante[0]?.fabricante ?? '—'}
              </span>{' '}
              ({data.porFabricante[0]?.quantidade ?? 0} unidades)
            </p>
          </Card>
        </>
      )}

      <AircraftDetailModal aircraft={viewing} onClose={() => setViewing(null)} />
    </div>
  )
}
