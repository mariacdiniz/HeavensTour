import { z } from 'zod'
import { MANUFACTURERS } from '@/data/constants'

const manufacturerEnum = z.enum(MANUFACTURERS)

function icaoMatchesManufacturer(icao: string, marca: string): boolean {
  const expected = marca.trim().charAt(0).toUpperCase()
  return icao.charAt(0).toUpperCase() === expected
}

export const aircraftFormSchema = z
  .object({
    nome: z.string().min(2, 'Informe o nome do modelo'),
    marca: manufacturerEnum,
    ano: z
      .number({ error: 'Ano inválido' })
      .int()
      .min(1950, 'Ano mínimo: 1950')
      .max(new Date().getFullYear() + 1, 'Ano não pode ser futuro distante'),
    descricao: z.string().min(10, 'Descrição com pelo menos 10 caracteres'),
    vendido: z.boolean(),
    icaoCode: z
      .string()
      .length(4, 'ICAO deve ter 4 caracteres')
      .regex(/^[A-Z0-9]{4}$/i, 'Use apenas letras e números (ex: B738)')
      .transform((v) => v.toUpperCase()),
    capacidadeCombustivel: z
      .number({ error: 'Capacidade inválida' })
      .positive('Capacidade deve ser positiva'),
    consumoMedio: z
      .number({ error: 'Consumo inválido' })
      .positive('Consumo deve ser positivo'),
  })
  .refine((data) => icaoMatchesManufacturer(data.icaoCode, data.marca), {
    message: 'Primeira letra do ICAO deve corresponder à marca (ex: Boeing → B)',
    path: ['icaoCode'],
  })

export type AircraftFormValues = z.infer<typeof aircraftFormSchema>
