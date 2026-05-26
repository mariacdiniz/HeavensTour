import { Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Aircraft } from '@/types/aircraft'
import { AutonomyBadge, StatusBadge } from '@/components/aircraft/AircraftBadges'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface AircraftTableProps {
  items: Aircraft[]
  onView: (aircraft: Aircraft) => void
  onDelete: (aircraft: Aircraft) => void
}

export function AircraftTable({ items, onView, onDelete }: AircraftTableProps) {
  const { hasRole } = useAuth()
  const canDelete = hasRole('admin')

  if (items.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <p className="font-medium">Nenhuma aeronave encontrada</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajuste os filtros ou cadastre uma nova unidade.
        </p>
        <Button className="mt-4" asChild>
          <Link to="/app/aeronaves/nova">Cadastrar aeronave</Link>
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-6">
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
              <th className="pb-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="pb-3 text-xs font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((aircraft) => (
              <tr
                key={aircraft.id}
                className="cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/50"
                onClick={() => onView(aircraft)}
              >
                <td className="py-4 text-sm font-medium">{aircraft.icaoCode}</td>
                <td className="py-4 text-sm">{aircraft.nome}</td>
                <td className="py-4 text-sm text-muted-foreground">{aircraft.marca}</td>
                <td className="py-4 text-sm text-muted-foreground">{aircraft.ano}</td>
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
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          'size-8 text-destructive hover:bg-destructive/10 hover:text-destructive',
                        )}
                        onClick={() => onDelete(aircraft)}
                        aria-label="Excluir"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Clique em uma linha para ver os detalhes completos da aeronave.
      </p>
    </Card>
  )
}
