function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Sem permissão para esta ação' })
    }
    next()
  }
}

module.exports = { requireRole }
