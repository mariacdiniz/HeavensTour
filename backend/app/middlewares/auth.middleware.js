const { verifyToken } = require('../../config/jwt')

function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não informado' })
  }

  const token = header.slice(7)
  try {
    const payload = verifyToken(token)
    req.user = {
      id: payload.id,
      role: payload.role,
    }
    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' })
  }
}

module.exports = { authMiddleware }
