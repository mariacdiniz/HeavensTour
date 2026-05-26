const mongoose = require('mongoose')
const env = require('./env')
const logger = require('../app/observability/logger')

async function connectDatabase() {
  mongoose.set('strictQuery', true)
  await mongoose.connect(env.mongoUri)
  logger.info({ uri: env.mongoUri.replace(/\/\/.*@/, '//***@') }, 'MongoDB conectado')
}

async function disconnectDatabase() {
  await mongoose.disconnect()
}

module.exports = { connectDatabase, disconnectDatabase }
