const logger = require('../observability/logger')

function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Erro interno do servidor'

  if (statusCode >= 500) {
    logger.error({ err, path: req.path }, message)
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message, errors: err.errors })
  }

  res.status(statusCode).json({ message })
}

module.exports = { errorHandler }
