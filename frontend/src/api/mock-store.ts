import { initialAircrafts } from '@/data/mock-aircraft'
import { DEMO_CREDENTIALS } from '@/data/constants'
import type { Aircraft, AircraftInput, AircraftSearchParams } from '@/types/aircraft'
import type { AuthResponse, LoginInput, User } from '@/types/auth'
import type { ReportDashboard } from '@/types/reports'
import { calculateAutonomyKm, getAutonomyCategory } from '@/utils/autonomy'

const STORAGE_KEY = 'heavens_tour_aircrafts'

function loadAircrafts(): Aircraft[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAircrafts))
    return [...initialAircrafts]
  }
  return JSON.parse(raw) as Aircraft[]
}

function saveAircrafts(list: Aircraft[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

const users: User[] = [
  { id: 'u1', nome: 'Admin Heavens', email: DEMO_CREDENTIALS.admin.email, role: 'admin' },
  { id: 'u2', nome: 'Operador', email: DEMO_CREDENTIALS.user.email, role: 'user' },
]

function enrich(input: AircraftInput, id: string, createdAt?: string): Aircraft {
  const autonomiaKm = calculateAutonomyKm(
    input.capacidadeCombustivel,
    input.consumoMedio,
  )
  const now = new Date().toISOString()
  return {
    id,
    ...input,
    icaoCode: input.icaoCode.toUpperCase(),
    autonomiaKm,
    categoriaAutonomia: getAutonomyCategory(autonomiaKm),
    imagemUrl: input.imagemUrl,
    createdAt: createdAt ?? now,
    updatedAt: now,
  }
}

export const mockApi = {
  async login(payload: LoginInput): Promise<AuthResponse> {
    const match =
      (payload.email === DEMO_CREDENTIALS.admin.email &&
        payload.password === DEMO_CREDENTIALS.admin.password) ||
      (payload.email === DEMO_CREDENTIALS.user.email &&
        payload.password === DEMO_CREDENTIALS.user.password)

    if (!match) {
      throw new Error('Credenciais inválidas')
    }

    const user = users.find((u) => u.email === payload.email)!
    return delay({
      token: `mock-jwt-${user.id}`,
      user,
    })
  },

  async listAircrafts(
    params: AircraftSearchParams = {},
  ): Promise<{ data: Aircraft[]; total: number; page: number; limit: number }> {
    let list = loadAircrafts()
    const {
      nome,
      marca,
      ano,
      decada,
      vendido,
      categoriaAutonomia,
      createdFrom,
      createdTo,
      page = 1,
      limit = 10,
    } = params

    if (nome) {
      const q = nome.toLowerCase()
      list = list.filter((a) => a.nome.toLowerCase().includes(q))
    }
    if (marca) {
      list = list.filter((a) => a.marca.toLowerCase() === marca.toLowerCase())
    }
    if (ano) list = list.filter((a) => a.ano === ano)
    if (decada) list = list.filter((a) => Math.floor(a.ano / 10) * 10 === decada)
    if (vendido !== undefined) list = list.filter((a) => a.vendido === vendido)
    if (categoriaAutonomia) {
      list = list.filter((a) => a.categoriaAutonomia === categoriaAutonomia)
    }
    if (createdFrom) {
      list = list.filter((a) => new Date(a.createdAt) >= new Date(createdFrom))
    }
    if (createdTo) {
      list = list.filter((a) => new Date(a.createdAt) <= new Date(createdTo))
    }

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const total = list.length
    const start = (page - 1) * limit
    const data = list.slice(start, start + limit)

    return delay({ data, total, page, limit })
  },

  async getAircraft(id: string): Promise<Aircraft | null> {
    const found = loadAircrafts().find((a) => a.id === id) ?? null
    return delay(found)
  },

  async createAircraft(input: AircraftInput): Promise<Aircraft> {
    const list = loadAircrafts()
    const duplicate = list.find(
      (a) => a.icaoCode.toUpperCase() === input.icaoCode.toUpperCase(),
    )
    if (duplicate) throw new Error('ICAO já cadastrado')

    const aircraft = enrich(input, crypto.randomUUID())
    list.unshift(aircraft)
    saveAircrafts(list)
    return delay(aircraft)
  },

  async updateAircraft(id: string, input: AircraftInput): Promise<Aircraft> {
    const list = loadAircrafts()
    const idx = list.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error('Aeronave não encontrada')

    const duplicate = list.find(
      (a) => a.id !== id && a.icaoCode.toUpperCase() === input.icaoCode.toUpperCase(),
    )
    if (duplicate) throw new Error('ICAO já cadastrado')

    const updated = enrich(input, id, list[idx].createdAt)
    updated.imagemUrl = list[idx].imagemUrl
    list[idx] = updated
    saveAircrafts(list)
    return delay(updated)
  },

  async deleteAircraft(id: string): Promise<void> {
    const list = loadAircrafts().filter((a) => a.id !== id)
    saveAircrafts(list)
    return delay(undefined)
  },

  async uploadImage(id: string, file: File): Promise<string> {
    const maxBytes = 5 * 1024 * 1024
    if (file.size > maxBytes) throw new Error('Imagem deve ter no máximo 5 MB')

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Falha ao ler arquivo'))
      reader.readAsDataURL(file)
    })

    const list = loadAircrafts()
    const idx = list.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error('Aeronave não encontrada')

    list[idx] = {
      ...list[idx],
      imagemUrl: dataUrl,
      updatedAt: new Date().toISOString(),
    }
    saveAircrafts(list)
    return delay(dataUrl)
  },

  async getReports(): Promise<ReportDashboard> {
    const list = loadAircrafts()
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

    const porDecadaMap = new Map<number, number>()
    const porFabricanteMap = new Map<string, number>()

    for (const a of list) {
      const decada = Math.floor(a.ano / 10) * 10
      porDecadaMap.set(decada, (porDecadaMap.get(decada) ?? 0) + 1)
      porFabricanteMap.set(a.marca, (porFabricanteMap.get(a.marca) ?? 0) + 1)
    }

    return delay({
      naoVendidas: list.filter((a) => !a.vendido).length,
      porDecada: [...porDecadaMap.entries()]
        .map(([decada, quantidade]) => ({ decada, quantidade }))
        .sort((a, b) => a.decada - b.decada),
      porFabricante: [...porFabricanteMap.entries()]
        .map(([fabricante, quantidade]) => ({ fabricante, quantidade }))
        .sort((a, b) => b.quantidade - a.quantidade),
      ultimaSemana: list.filter((a) => new Date(a.createdAt).getTime() >= weekAgo)
        .length,
    })
  },
}
