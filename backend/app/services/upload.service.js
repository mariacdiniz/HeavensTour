const path = require('path')
const { randomUUID } = require('crypto')
const env = require('../../config/env')
const { uploadToS3, uploadToLocal } = require('../integrations/s3Client')
const aircraftService = require('./aircraft.service')

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

async function uploadAircraftImage(aircraftId, file, user) {
  if (!file) {
    const err = new Error('Arquivo não enviado')
    err.statusCode = 400
    throw err
  }

  if (!ALLOWED.includes(file.mimetype)) {
    const err = new Error('Formato inválido. Use JPEG, PNG ou WebP')
    err.statusCode = 400
    throw err
  }

  if (file.size > MAX_BYTES) {
    const err = new Error('Imagem deve ter no máximo 5 MB')
    err.statusCode = 400
    throw err
  }

  await aircraftService.getById(aircraftId, user)

  const ext = path.extname(file.originalname) || '.jpg'
  const key = `aircraft/${aircraftId}/${randomUUID()}${ext}`

  let imagemUrl
  if (env.uploadMode === 's3') {
    imagemUrl = await uploadToS3(file.buffer, key, file.mimetype)
  } else {
    imagemUrl = await uploadToLocal(file.buffer, `${aircraftId}-${Date.now()}${ext}`)
  }

  return aircraftService.setImageUrl(aircraftId, imagemUrl, user)
}

module.exports = { uploadAircraftImage }
