import { apiClient } from '@/api/client'
import type {
  Aircraft,
  AircraftInput,
  AircraftListResponse,
  AircraftSearchParams,
} from '@/types/aircraft'
import type { ReportDashboard } from '@/types/reports'
import { mockApi } from '@/api/mock-store'
import { resolveAircraftImageUrl } from '@/utils/imageUrl'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

function hasSearchFilters(params?: AircraftSearchParams) {
  if (!params) return false
  return Boolean(
    params.nome ||
      params.marca ||
      params.ano ||
      params.decada ||
      params.vendido !== undefined ||
      params.categoriaAutonomia ||
      params.createdFrom ||
      params.createdTo,
  )
}

function mapAircraft(a: Aircraft): Aircraft {
  return { ...a, imagemUrl: resolveAircraftImageUrl(a.imagemUrl) }
}

export const aircraftApi = {
  async list(params?: AircraftSearchParams): Promise<AircraftListResponse> {
    if (USE_MOCK) return mockApi.listAircrafts(params)

    const endpoint = hasSearchFilters(params) ? '/aeronaves/search' : '/aeronaves'
    const { data } = await apiClient.get<AircraftListResponse>(endpoint, {
      params,
    })
    return {
      ...data,
      data: data.data.map(mapAircraft),
    }
  },

  async getById(id: string): Promise<Aircraft | null> {
    if (USE_MOCK) return mockApi.getAircraft(id)

    try {
      const { data } = await apiClient.get<Aircraft>(`/aeronaves/${id}`)
      return mapAircraft(data)
    } catch {
      return null
    }
  },

  async create(input: AircraftInput): Promise<Aircraft> {
    if (USE_MOCK) return mockApi.createAircraft(input)

    const { data } = await apiClient.post<Aircraft>('/aeronaves', input)
    return mapAircraft(data)
  },

  async update(id: string, input: AircraftInput): Promise<Aircraft> {
    if (USE_MOCK) return mockApi.updateAircraft(id, input)

    const { data } = await apiClient.put<Aircraft>(`/aeronaves/${id}`, input)
    return mapAircraft(data)
  },

  async remove(id: string): Promise<void> {
    if (USE_MOCK) return mockApi.deleteAircraft(id)

    await apiClient.delete(`/aeronaves/${id}`)
  },

  async reports(): Promise<ReportDashboard> {
    if (USE_MOCK) return mockApi.getReports()

    const { data } = await apiClient.get<ReportDashboard>('/relatorios/dashboard')
    return data
  },

  async uploadImage(id: string, file: File): Promise<string> {
    if (USE_MOCK) return mockApi.uploadImage(id, file)

    const form = new FormData()
    form.append('imagem', file)
    const { data } = await apiClient.post<Aircraft>(`/aeronaves/${id}/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return resolveAircraftImageUrl(data.imagemUrl) ?? ''
  },
}

export type { Aircraft }
