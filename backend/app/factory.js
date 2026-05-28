require('express-async-errors')
const path = require('path')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const swaggerUi = require('swagger-ui-express')
const env = require('../config/env')
const routes = require('../routes')
const { errorHandler } = require('./middlewares/errorHandler.middleware')
const swaggerDocument = require('./docs/swagger')
const { ensureLocalUploadDir } = require('./integrations/s3Client')
const { getUploadDir } = require('./utils/uploadPaths')

function buildApp() {
  if (env.uploadMode === 'local') {
    ensureLocalUploadDir()
  }

  const app = express()

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || env.corsOrigins.includes(origin)) {
          callback(null, true)
          return
        }
        callback(null, false)
      },
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '2mb' }))
  app.use(express.urlencoded({ extended: true }))

  if (env.uploadMode === 'local') {
    const uploadDir = getUploadDir()
    ensureLocalUploadDir()
    app.use('/uploads', express.static(uploadDir))
  }

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: 'HeavensTour API Docs',
    }),
  )
  app.use(routes)
  app.use(errorHandler)

  return app
}

module.exports = { buildApp }
