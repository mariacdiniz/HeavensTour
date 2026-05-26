const { z } = require('../zod-extend')

const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['user', 'admin']).optional().default('user'),
}).transform((data) => ({
  nome: data.nome,
  email: data.email,
  senha: data.senha || data.password,
  role: data.role,
})).refine((data) => Boolean(data.senha), { message: 'Senha obrigatória', path: ['senha'] })

const loginSchema = z
  .object({
    email: z.string().email('E-mail inválido'),
    senha: z.string().optional(),
    password: z.string().optional(),
  })
  .transform((data) => ({
    email: data.email,
    senha: data.senha || data.password,
  }))
  .refine((data) => Boolean(data.senha), {
    message: 'Senha obrigatória',
    path: ['senha'],
  })

module.exports = { registerSchema, loginSchema }
