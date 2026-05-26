import type { AircraftSearchParams } from '@/types/aircraft'

export const DEFAULT_AIRCRAFT_FILTERS: AircraftSearchParams = {
  page: 1,
  limit: 20,
}

export function hasActiveFilters(filters: AircraftSearchParams) {
  return Boolean(
    filters.nome ||
      filters.marca ||
      filters.ano ||
      filters.decada ||
      filters.vendido !== undefined ||
      filters.categoriaAutonomia,
  )
}
