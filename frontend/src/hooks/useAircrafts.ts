import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { aircraftApi } from '@/api/aircraft.api'
import type { AircraftInput, AircraftSearchParams } from '@/types/aircraft'

export function useAircraftList(params: AircraftSearchParams) {
  return useQuery({
    queryKey: ['aircrafts', params],
    queryFn: () => aircraftApi.list(params),
  })
}

export function useAircraft(id: string | undefined) {
  return useQuery({
    queryKey: ['aircraft', id],
    queryFn: () => aircraftApi.getById(id!),
    enabled: Boolean(id),
  })
}

export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => aircraftApi.reports(),
  })
}

export function useAircraftMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['aircrafts'] })
    queryClient.invalidateQueries({ queryKey: ['reports'] })
    queryClient.invalidateQueries({ queryKey: ['aircraft'] })
  }

  const create = useMutation({
    mutationFn: (input: AircraftInput) => aircraftApi.create(input),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: AircraftInput }) =>
      aircraftApi.update(id, input),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => aircraftApi.remove(id),
    onSuccess: invalidate,
  })

  const uploadImage = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      aircraftApi.uploadImage(id, file),
    onSuccess: invalidate,
  })

  return { create, update, remove, uploadImage }
}
