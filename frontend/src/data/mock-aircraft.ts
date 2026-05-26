import type { Aircraft } from '@/types/aircraft'
import { calculateAutonomyKm, getAutonomyCategory } from '@/utils/autonomy'

function build(
  partial: Omit<Aircraft, 'autonomiaKm' | 'categoriaAutonomia'> & {
    capacidadeCombustivel: number
    consumoMedio: number
  },
): Aircraft {
  const autonomiaKm = calculateAutonomyKm(
    partial.capacidadeCombustivel,
    partial.consumoMedio,
  )
  return {
    ...partial,
    autonomiaKm,
    categoriaAutonomia: getAutonomyCategory(autonomiaKm),
  }
}

const now = new Date()
const daysAgo = (n: number) =>
  new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString()

export const initialAircrafts: Aircraft[] = [
  build({
    id: '1',
    nome: '737-800',
    marca: 'Boeing',
    ano: 2018,
    descricao: 'Narrow-body de alta eficiência para rotas domésticas e regionais.',
    vendido: false,
    icaoCode: 'B738',
    capacidadeCombustivel: 26020,
    consumoMedio: 0.12,
    imagemUrl:
      'https://images.unsplash.com/photo-1436491865339-9a109ced8366?w=800&q=80&auto=format',
    createdAt: daysAgo(45),
    updatedAt: daysAgo(2),
  }),
  build({
    id: '2',
    nome: 'E175',
    marca: 'Embraer',
    ano: 2019,
    descricao: 'Jato regional com excelente economia por assento.',
    vendido: true,
    icaoCode: 'E175',
    imagemUrl:
      'https://images.unsplash.com/photo-1529073469769-566c6a4e1e2a?w=800&q=80&auto=format',
    capacidadeCombustivel: 12900,
    consumoMedio: 0.18,
    createdAt: daysAgo(120),
    updatedAt: daysAgo(30),
  }),
  build({
    id: '3',
    nome: 'A320neo',
    marca: 'Airbus',
    ano: 2021,
    descricao: 'Família A320 com motores de nova geração e menor consumo.',
    vendido: false,
    icaoCode: 'A20N',
    imagemUrl:
      'https://images.unsplash.com/photo-1556388150-d0742dbb036a?w=800&q=80&auto=format',
    capacidadeCombustivel: 24210,
    consumoMedio: 0.14,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  }),
  build({
    id: '4',
    nome: 'E195-E2',
    marca: 'Embraer',
    ano: 2022,
    descricao: 'Evolução do E-Jets com alcance estendido para rotas médias.',
    vendido: false,
    icaoCode: 'E295',
    imagemUrl:
      'https://images.unsplash.com/photo-1540962351504-03099e1ffb2e?w=800&q=80&auto=format',
    capacidadeCombustivel: 15500,
    consumoMedio: 0.22,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  }),
  build({
    id: '5',
    nome: '787-9',
    marca: 'Boeing',
    ano: 2015,
    descricao: 'Wide-body composto para rotas intercontinentais de longo alcance.',
    vendido: true,
    icaoCode: 'B789',
    imagemUrl:
      'https://images.unsplash.com/photo-1464033890889-9f00f3108229?w=800&q=80&auto=format',
    capacidadeCombustivel: 126206,
    consumoMedio: 0.09,
    createdAt: daysAgo(2000),
    updatedAt: daysAgo(400),
  }),
]
