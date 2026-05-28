import { z } from 'zod'

export const registerSchema = z.object({
  nome: z.string().min(2, 'Informe seu nome'),
  email: z.email('E-mail inválido'),
  password: z.string().min(6, 'Senha com pelo menos 6 caracteres'),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
