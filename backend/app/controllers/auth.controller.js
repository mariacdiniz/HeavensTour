const { registerUseCase } = require('../useCase/auth/register.useCase')
const { loginUseCase } = require('../useCase/auth/login.useCase')

async function register(req, res) {
  const body = req.validated
  const result = await registerUseCase({
    nome: body.nome,
    email: body.email,
    senha: body.senha,
    role: body.role,
  })
  res.status(201).json(result)
}

async function login(req, res) {
  const { email, senha } = req.validated
  const result = await loginUseCase({ email, senha })
  res.json(result)
}

module.exports = { register, login }
