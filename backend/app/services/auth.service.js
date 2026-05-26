const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { signToken } = require('../../config/jwt')

const SALT_ROUNDS = 10

async function register({ nome, email, senha, role = 'user' }) {
  const exists = await User.findOne({ email })
  if (exists) {
    const err = new Error('E-mail já cadastrado')
    err.statusCode = 409
    throw err
  }

  const passwordHash = await bcrypt.hash(senha, SALT_ROUNDS)
  const user = await User.create({ nome, email, passwordHash, role })

  const token = signToken({ id: user._id.toString(), role: user.role })

  return {
    token,
    user: {
      id: user._id.toString(),
      nome: user.nome,
      email: user.email,
      role: user.role,
    },
  }
}

async function login({ email, senha }) {
  const user = await User.findOne({ email }).select('+passwordHash')
  if (!user) {
    const err = new Error('Credenciais inválidas')
    err.statusCode = 401
    throw err
  }

  const valid = await bcrypt.compare(senha, user.passwordHash)
  if (!valid) {
    const err = new Error('Credenciais inválidas')
    err.statusCode = 401
    throw err
  }

  const token = signToken({ id: user._id.toString(), role: user.role })

  return {
    token,
    user: {
      id: user._id.toString(),
      nome: user.nome,
      email: user.email,
      role: user.role,
    },
  }
}

module.exports = { register, login }
