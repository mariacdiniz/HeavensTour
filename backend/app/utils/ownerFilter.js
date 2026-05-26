const mongoose = require('mongoose')

/** Admin vê tudo; demais usuários só registros com criadoPor = user.id */
function getOwnerFilter(user) {
  if (!user || user.role === 'admin') {
    return {}
  }
  return { criadoPor: new mongoose.Types.ObjectId(user.id) }
}

function mergeOwnerFilter(query, user) {
  return { ...query, ...getOwnerFilter(user) }
}

module.exports = { getOwnerFilter, mergeOwnerFilter }
