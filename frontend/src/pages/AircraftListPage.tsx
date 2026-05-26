import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAircraftList, useAircraftMutations } from '@/hooks/useAircrafts'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import {
  AircraftFilters,
  DEFAULT_AIRCRAFT_FILTERS,
} from '@/components/aircraft/AircraftFilters'
import { AircraftTable } from '@/components/aircraft/AircraftTable'
import { AircraftDetailModal } from '@/components/aircraft/AircraftDetailModal'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/contexts/ToastContext'
import type { Aircraft, AircraftSearchParams } from '@/types/aircraft'

const PAGE_SIZE = 20

export function AircraftListPage() {
  const [filters, setFilters] = useState<AircraftSearchParams>(DEFAULT_AIRCRAFT_FILTERS)
  const [page, setPage] = useState(1)

  const debouncedCriteria = useDebouncedValue(
    useMemo(
      () => ({
        nome: filters.nome,
        marca: filters.marca,
        ano: filters.ano,
        decada: filters.decada,
        vendido: filters.vendido,
        categoriaAutonomia: filters.categoriaAutonomia,
      }),
      [
        filters.nome,
        filters.marca,
        filters.ano,
        filters.decada,
        filters.vendido,
        filters.categoriaAutonomia,
      ],
    ),
    400,
  )

  useEffect(() => {
    setPage(1)
  }, [debouncedCriteria])

  const applied: AircraftSearchParams = {
    ...debouncedCriteria,
    page,
    limit: PAGE_SIZE,
  }

  const { data, isLoading, isFetching, refetch } = useAircraftList(applied)
  const { remove } = useAircraftMutations()
  const { toast } = useToast()
  const [deleting, setDeleting] = useState<Aircraft | null>(null)
  const [viewing, setViewing] = useState<Aircraft | null>(null)

  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, total)

  const clearFilters = () => {
    setFilters(DEFAULT_AIRCRAFT_FILTERS)
    setPage(1)
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await remove.mutateAsync(deleting.id)
      toast({
        title: 'Aeronave removida',
        description: `${deleting.nome} foi excluída da frota.`,
        variant: 'success',
      })
      setDeleting(null)
      if (viewing?.id === deleting.id) setViewing(null)
    } catch (e) {
      toast({
        title: 'Erro ao excluir',
        description: e instanceof Error ? e.message : 'Tente novamente.',
        variant: 'error',
      })
    }
  }

  return (
    <div className="space-y-6 p-8">
      <AircraftFilters filters={filters} onChange={setFilters} onClear={clearFilters} />

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Spinner className="size-8" />
        </div>
      ) : (
        <>
          <AircraftTable
            items={data?.data ?? []}
            onView={(a) => setViewing(a)}
            onDelete={(a) => setDeleting(a)}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {isFetching ? 'Atualizando...' : `Exibindo ${from} a ${to} de ${total} resultados`}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-4" />
                Anterior
              </Button>
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
                {page}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
                <ChevronRight className="size-4" />
              </Button>
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 text-sm text-primary hover:underline"
              >
                Atualizar
              </button>
            </div>
          </div>
        </>
      )}

      <AircraftDetailModal aircraft={viewing} onClose={() => setViewing(null)} />

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <Card className="max-w-md p-6">
            <h3 className="text-lg font-medium">Confirmar exclusão</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Remover {deleting.nome} ({deleting.icaoCode})? Esta ação não pode ser desfeita.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleting(null)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={remove.isPending}
              >
                {remove.isPending ? 'Excluindo...' : 'Excluir'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
