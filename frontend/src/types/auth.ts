export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  nome: string
  email: string
  role: UserRole
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginInput {
  email: string
  password: string
}
