require('dotenv').config()
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const env = require('../config/env')
const User = require('../app/models/User')
const Aircraft = require('../app/models/Aircraft')

const aircrafts = [
  {
    nome: '737-800',
    marca: 'Boeing',
    ano: 2018,
    descricao: 'Narrow-body de alta eficiência para rotas domésticas e regionais.',
    vendido: false,
    icaoCode: 'B738',
    capacidadeCombustivel: 26020,
    consumoMedio: 0.12,
  },
  {
    nome: 'E175',
    marca: 'Embraer',
    ano: 2019,
    descricao: 'Jato regional com excelente economia por assento.',
    vendido: true,
    icaoCode: 'E175',
    capacidadeCombustivel: 12900,
    consumoMedio: 0.18,
  },
  {
    nome: 'A320neo',
    marca: 'Airbus',
    ano: 2021,
    descricao: 'Família A320 com motores de nova geração.',
    vendido: false,
    icaoCode: 'A20N',
    capacidadeCombustivel: 24210,
    consumoMedio: 0.14,
  },
]

async function seed() {
  await mongoose.connect(env.mongoUri)
  console.log('MongoDB conectado')

  await User.deleteMany({})
  await Aircraft.deleteMany({})

  const adminHash = await bcrypt.hash('admin123', 10)
  const userHash = await bcrypt.hash('user123', 10)

  const [admin, operador] = await User.create([
    {
      nome: 'Admin Heavens',
      email: 'admin@heavenstour.com',
      passwordHash: adminHash,
      role: 'admin',
    },
    {
      nome: 'Operador',
      email: 'user@heavenstour.com',
      passwordHash: userHash,
      role: 'user',
    },
  ])

  for (let i = 0; i < aircrafts.length; i++) {
    await Aircraft.create({
      ...aircrafts[i],
      criadoPor: i === 0 ? admin._id : operador._id,
    })
  }

  console.log('Seed concluído:')
  console.log('  admin@heavenstour.com / admin123')
  console.log('  user@heavenstour.com / user123')
  console.log(`  ${aircrafts.length} aeronaves`)

  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
