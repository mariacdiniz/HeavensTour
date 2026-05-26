import type { AutonomyCategory } from '@/types/aircraft'

export function calculateAutonomyKm(
  capacidadeCombustivel: number,
  consumoMedio: number,
): number {
  return capacidadeCombustivel * consumoMedio
}

export function getAutonomyCategory(autonomiaKm: number): AutonomyCategory {
  if (autonomiaKm <= 3000) return 'Curta'
  if (autonomiaKm <= 7000) return 'Média'
  return 'Longa'
}
