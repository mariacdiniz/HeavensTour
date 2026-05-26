require('dotenv').config()

const DEV_CORS_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://host.docker.internal:5173',
]

function parseCorsOrigins() {
  const raw =
    process.env.CORS_ORIGINS ||
    process.env.FRONTEND_URL ||
    'http://localhost:5173'
  const fromEnv = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if ((process.env.NODE_ENV || 'development') === 'development') {
    return [...new Set([...fromEnv, ...DEV_CORS_ORIGINS])]
  }
  return [...new Set(fromEnv)]
}

const corsOrigins = parseCorsOrigins()

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3333,
  mongoUri:
    process.env.MONGO_URI || 'mongodb://localhost:27017/heavenstour',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: corsOrigins[0],
  corsOrigins,
  uploadMode: process.env.UPLOAD_MODE || 'local',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
    endpoint: process.env.AWS_ENDPOINT,
    /** URL acessível pelo navegador (ex.: localhost em vez de hostname Docker) */
    publicEndpoint:
      process.env.AWS_PUBLIC_ENDPOINT ||
      (process.env.AWS_ENDPOINT
        ? process.env.AWS_ENDPOINT.replace(/:\/\/localstack/i, '://localhost')
        : undefined),
    bucket: process.env.AWS_BUCKET || 'heavens-tour-aircraft',
    forcePathStyle: process.env.AWS_FORCE_PATH_STYLE !== 'false',
  },
  logLevel: process.env.LOG_LEVEL || 'info',
}

module.exports = env
