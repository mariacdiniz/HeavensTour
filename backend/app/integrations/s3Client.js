const fs = require('fs')
const path = require('path')
const {
  S3Client,
  PutObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} = require('@aws-sdk/client-s3')
const env = require('../../config/env')
const logger = require('../observability/logger')

let s3Client = null

function getS3Client() {
  if (s3Client) return s3Client

  const config = {
    region: env.aws.region,
    credentials: {
      accessKeyId: env.aws.accessKeyId,
      secretAccessKey: env.aws.secretAccessKey,
    },
  }

  if (env.aws.endpoint) {
    config.endpoint = env.aws.endpoint
    config.forcePathStyle = env.aws.forcePathStyle
  }

  s3Client = new S3Client(config)
  return s3Client
}

async function ensureBucket() {
  if (env.uploadMode !== 's3') return

  const client = getS3Client()
  try {
    await client.send(new HeadBucketCommand({ Bucket: env.aws.bucket }))
  } catch {
    try {
      await client.send(new CreateBucketCommand({ Bucket: env.aws.bucket }))
      logger.info({ bucket: env.aws.bucket }, 'Bucket S3 criado')
    } catch (err) {
      logger.warn({ err }, 'Não foi possível criar bucket (pode já existir)')
    }
  }
}

async function uploadToS3(buffer, key, contentType) {
  const client = getS3Client()
  await client.send(
    new PutObjectCommand({
      Bucket: env.aws.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  )

  if (env.aws.endpoint) {
    const base = (env.aws.publicEndpoint || env.aws.endpoint).replace(/\/$/, '')
    return `${base}/${env.aws.bucket}/${key}`
  }
  return `https://${env.aws.bucket}.s3.${env.aws.region}.amazonaws.com/${key}`
}

function ensureLocalUploadDir() {
  const dir = path.resolve(process.cwd(), env.uploadDir)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return dir
}

async function uploadToLocal(buffer, filename) {
  const dir = ensureLocalUploadDir()
  const filePath = path.join(dir, filename)
  await fs.promises.writeFile(filePath, buffer)
  return `/uploads/${filename}`
}

module.exports = {
  getS3Client,
  ensureBucket,
  uploadToS3,
  uploadToLocal,
  ensureLocalUploadDir,
}
