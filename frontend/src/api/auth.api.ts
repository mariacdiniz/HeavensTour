import { apiClient } from '@/api/client'
import type { AuthResponse, LoginInput } from '@/types/auth'
import { mockApi } from '@/api/mock-store'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' // padrão: API real

export const authApi = {
  async login(payload: LoginInput): Promise<AuthResponse> {
    if (USE_MOCK) return mockApi.login(payload)

    const { data } = await apiClient.post<AuthResponse>('/auth/login', {
      email: payload.email,
      password: payload.password,
    })
    return data
  },

  async register(payload: {
    nome: string
    email: string
    password: string
  }): Promise<AuthResponse> {
    if (USE_MOCK) {
      throw new Error('Registro mock não implementado — use a API')
    }

    const { data } = await apiClient.post<AuthResponse>('/auth/register', {
      nome: payload.nome,
      email: payload.email,
      password: payload.password,
    })
    return data
  },
}
