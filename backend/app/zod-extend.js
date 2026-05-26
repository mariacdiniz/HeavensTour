const { z } = require('zod')

/** Mensagens padronizadas em português para validação HTTP */
z.setErrorMap((issue, ctx) => {
  if (issue.code === 'invalid_type') {
    return { message: 'Tipo de dado inválido' }
  }
  if (issue.code === 'too_small') {
    return { message: ctx.defaultError }
  }
  return { message: ctx.defaultError }
})

module.exports = { z }
