function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source])
    if (!result.success) {
      return res.status(400).json({
        message: 'Validação falhou',
        errors: result.error.flatten(),
      })
    }
    req.validated = result.data
    next()
  }
}

module.exports = { validate }
