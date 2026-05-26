const env = require('./config/env')
const { connectDatabase } = require('./config/database')
const { buildApp } = require('./app/factory')
const { ensureBucket } = require('./app/integrations/s3Client')
const logger = require('./app/observability/logger')

async function bootstrap() {
  await connectDatabase()

  if (env.uploadMode === 's3') {
    await ensureBucket()
  }

  const app = buildApp()

  app.listen(env.port, () => {
    logger.info(
      { port: env.port, docs: `http://localhost:${env.port}/api-docs` },
      'HeavensTour API no ar',
    )
  })
}

bootstrap().catch((err) => {
  logger.error(err, 'Falha ao iniciar API')
  process.exit(1)
})
