const mongoose = require('mongoose')

async function checkHealth() {
  const mongo = mongoose.connection.readyState === 1
  return { mongo, status: mongo ? 'healthy' : 'degraded' }
}

module.exports = { checkHealth }
