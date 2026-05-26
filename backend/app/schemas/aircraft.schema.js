const { z } = require('../zod-extend')
const { MANUFACTURERS } = require('../utils/manufacturer')

const aircraftBodySchema = z.object({
  nome: z.string().min(2),
  marca: z.enum(MANUFACTURERS),
  ano: z.number().int().min(1950).max(new Date().getFullYear() + 1),
  descricao: z.string().min(10),
  vendido: z.boolean(),
  icaoCode: z
    .string()
    .length(4)
    .regex(/^[A-Za-z0-9]{4}$/)
    .transform((v) => v.toUpperCase()),
  capacidadeCombustivel: z.number().positive(),
  consumoMedio: z.number().positive(),
})

const searchQuerySchema = z.object({
  nome: z.string().optional(),
  marca: z.string().optional(),
  ano: z.coerce.number().int().optional(),
  decada: z.coerce.number().int().optional(),
  vendido: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  categoriaAutonomia: z.enum(['Curta', 'Média', 'Longa']).optional(),
  createdFrom: z.string().optional(),
  createdTo: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
})

module.exports = { aircraftBodySchema, searchQuerySchema }
