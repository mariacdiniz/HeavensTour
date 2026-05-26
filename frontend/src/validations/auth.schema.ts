import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(6, 'Senha com pelo menos 6 caracteres'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
