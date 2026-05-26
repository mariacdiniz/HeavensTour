const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  process.env.NODE_ENV = 'test'
  process.env.MONGO_URI = mongoServer.getUri()
  process.env.JWT_SECRET = 'test-jwt-secret-key-32chars-minimum'
  process.env.UPLOAD_MODE = 'local'
  process.env.UPLOAD_DIR = 'uploads-test'
  process.env.FRONTEND_URL = 'http://localhost:5173'
  await mongoose.connect(process.env.MONGO_URI)
})

afterEach(async () => {
  const collections = mongoose.connection.collections
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({})
  }
})

afterAll(async () => {
  await mongoose.disconnect()
  if (mongoServer) await mongoServer.stop()
})
