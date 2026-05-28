const path = require('path')
const env = require('../../config/env')

/** Sempre backend/uploads (ou UPLOAD_DIR absoluto), independente do cwd do processo */
function getUploadDir() {
  if (path.isAbsolute(env.uploadDir)) {
    return env.uploadDir
  }
  return path.resolve(__dirname, '../..', env.uploadDir)
}

module.exports = { getUploadDir }
