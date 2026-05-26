export type AutonomyCategory = 'Curta' | 'Média' | 'Longa'

export interface Aircraft {
  id: string
  nome: string
  marca: string
  ano: number
  descricao: string
  vendido: boolean
  icaoCode: string
  capacidadeCombustivel: number
  consumoMedio: number
  autonomiaKm: number
  categoriaAutonomia: AutonomyCategory
  imagemUrl?: string
  createdAt: string
  updatedAt: string
}

export interface AircraftInput {
  nome: string
  marca: string
  ano: number
  descricao: string
  vendido: boolean
  icaoCode: string
  capacidadeCombustivel: number
  consumoMedio: number
  imagemUrl?: string
}

export interface AircraftSearchParams {
  nome?: string
  marca?: string
  ano?: number
  decada?: number
  vendido?: boolean
  categoriaAutonomia?: AutonomyCategory
  createdFrom?: string
  createdTo?: string
  page?: number
  limit?: number
}

export interface AircraftListResponse {
  data: Aircraft[]
  total: number
  page: number
  limit: number
}
