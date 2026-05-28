import { Search, Plus, X, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MANUFACTURERS } from '@/data/constants'
import { DEFAULT_AIRCRAFT_FILTERS, hasActiveFilters } from '@/data/aircraft-filters'
import type { AircraftSearchParams } from '@/types/aircraft'
import { cn } from '@/lib/utils'

interface AircraftFiltersProps {
  filters: AircraftSearchParams
  onChange: (next: AircraftSearchParams) => void
  onClear: () => void
}

const selectClass =
  'h-10 rounded-lg border border-input bg-[var(--input-background)] pl-4 pr-10 text-sm text-foreground appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring '

export function AircraftFilters({ filters, onChange, onClear }: AircraftFiltersProps) {
  const showClear = hasActiveFilters(filters)

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome do modelo..."
          className="h-10 rounded-lg pl-10"
          value={filters.nome ?? ''}
          onChange={(e) =>
            onChange({ ...filters, nome: e.target.value || undefined, page: 1 })
          }
        />
      </div>

      <div className="relative">
        <select
          className={selectClass}
          value={filters.marca ?? ''}
          onChange={(e) =>
            onChange({ ...filters, marca: e.target.value || undefined, page: 1 })
          }
        >
          <option value="">Todos os fabricantes</option>
          {MANUFACTURERS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <Input
        type="number"
        placeholder="Ano"
        className={cn(selectClass, 'w-25')}
        value={filters.ano ?? ''}
        onChange={(e) =>
          onChange({
            ...filters,
            ano: e.target.value ? Number(e.target.value) : undefined,
            page: 1,
          })
        }
      />

      <div className="relative">
        <select
          className={selectClass}
          value={filters.categoriaAutonomia ?? ''}
          onChange={(e) =>
            onChange({
              ...filters,
              categoriaAutonomia:
                (e.target.value as AircraftSearchParams['categoriaAutonomia']) ||
                undefined,
              page: 1,
            })
          }
        >
          <option value="">Todas as autonomias</option>
          <option value="Curta">Curta</option>
          <option value="Média">Média</option>
          <option value="Longa">Longa</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <div className="relative">
        <select
          className={selectClass}
          value={
            filters.vendido === undefined ? '' : filters.vendido ? 'true' : 'false'
          }
          onChange={(e) => {
            const v = e.target.value
            onChange({
              ...filters,
              vendido: v === '' ? undefined : v === 'true',
              page: 1,
            })
          }}
        >
          <option value="">Todos os status</option>
          <option value="false">Disponível</option>
          <option value="true">Vendida</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {showClear && (
        <Button
          type="button"
          variant="outline"
          className="h-11 gap-2 rounded-lg"
          onClick={onClear}
        >
          <X className="size-4" />
          Limpar filtros
        </Button>
      )}

      <Button className="h-10 shrink-0 gap-2 rounded-lg" asChild>
        <Link to="/app/aeronaves/nova">
          <Plus className="size-4" />
          Nova aeronave
        </Link>
      </Button>
    </div>
  )
}

export { DEFAULT_AIRCRAFT_FILTERS }
