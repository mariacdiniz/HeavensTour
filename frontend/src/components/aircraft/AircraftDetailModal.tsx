import { Link } from 'react-router-dom'
import { X, Pencil, Fuel, Gauge } from 'lucide-react'
import type { Aircraft } from '@/types/aircraft'
import { AutonomyBadge, StatusBadge } from '@/components/aircraft/AircraftBadges'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatDate, formatKm, formatNumber } from '@/utils/format'

interface AircraftDetailModalProps {
  aircraft: Aircraft | null
  onClose: () => void
}

export function AircraftDetailModal({ aircraft, onClose }: AircraftDetailModalProps) {
  if (!aircraft) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <Card
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/7] bg-muted">
          {aircraft.imagemUrl ? (
            <img
              src={aircraft.imagemUrl}
              alt={aircraft.nome}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
              Sem imagem cadastrada
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-lg bg-background/90 p-2 shadow-sm transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label="Fechar"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-primary">{aircraft.icaoCode}</p>
              <h2 className="text-xl font-medium">{aircraft.nome}</h2>
              <p className="text-sm text-muted-foreground">
                {aircraft.marca} · {aircraft.ano}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge vendido={aircraft.vendido} />
              <AutonomyBadge category={aircraft.categoriaAutonomia} />
            </div>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {aircraft.descricao || 'Sem descrição informada.'}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Gauge className="size-3.5" />
                Autonomia de voo
              </div>
              <p className="text-lg font-medium">{formatKm(aircraft.autonomiaKm)}</p>
              <p className="text-xs text-muted-foreground">
                Categoria: {aircraft.categoriaAutonomia}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Fuel className="size-3.5" />
                Combustível
              </div>
              <p className="text-sm">
                Capacidade:{' '}
                <span className="font-medium">
                  {formatNumber(aircraft.capacidadeCombustivel)} L
                </span>
              </p>
              <p className="text-sm">
                Consumo:{' '}
                <span className="font-medium">{aircraft.consumoMedio} km/L</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>Cadastro: {formatDate(aircraft.createdAt)}</span>
            <span>Atualização: {formatDate(aircraft.updatedAt)}</span>
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button asChild className="gap-2">
              <Link to={`/app/aeronaves/${aircraft.id}/editar`}>
                <Pencil className="size-4" />
                Editar aeronave
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
