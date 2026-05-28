const request = require('supertest')
const bcrypt = require('bcryptjs')
const { buildApp } = require('../../app/factory')
const User = require('../../app/models/User')

let app

beforeAll(() => {
  app = buildApp()
})

async function getAdminToken() {
  const passwordHash = await bcrypt.hash('admin123', 10)
  await User.create({
    nome: 'Admin',
    email: 'admin@test.com',
    passwordHash,
    role: 'admin',
  })
  const login = await request(app).post('/auth/login').send({
    email: 'admin@test.com',
    senha: 'admin123',
  })
  return login.body.token
}

const sampleAircraft = {
  nome: '737-800',
  marca: 'Boeing',
  ano: 2018,
  descricao: 'Descrição de teste com mais de dez caracteres.',
  vendido: false,
  icaoCode: 'B738',
  capacidadeCombustivel: 26020,
  consumoMedio: 0.12,
}

describe('Aeronaves API', () => {
  let token

  beforeEach(async () => {
    token = await getAdminToken()
  })

  it('POST /aeronaves cria aeronave', async () => {
    const res = await request(app)
      .post('/aeronaves')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleAircraft)

    expect(res.status).toBe(201)
    expect(res.body.icaoCode).toBe('B738')
    expect(res.body.categoriaAutonomia).toBeDefined()
    expect(res.body.autonomiaKm).toBeGreaterThan(0)
  })

  it('GET /aeronaves lista', async () => {
    await request(app)
      .post('/aeronaves')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleAircraft)

    const res = await request(app)
      .get('/aeronaves')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.data.length).toBeGreaterThanOrEqual(1)
  })

  it('GET /aeronaves/search filtra por marca', async () => {
    await request(app)
      .post('/aeronaves')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleAircraft)

    const res = await request(app)
      .get('/aeronaves/search')
      .query({ marca: 'Boeing' })
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.data.every((a) => a.marca === 'Boeing')).toBe(true)
  })

  it('rejeita ICAO duplicado', async () => {
    await request(app)
      .post('/aeronaves')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleAircraft)

    const res = await request(app)
      .post('/aeronaves')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...sampleAircraft, nome: 'Outro' })

    expect(res.status).toBe(409)
  })

  it('GET /relatorios/dashboard', async () => {
    await request(app)
      .post('/aeronaves')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleAircraft)

    const res = await request(app)
      .get('/relatorios/dashboard')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('naoVendidas')
    expect(res.body).toHaveProperty('porDecada')
    expect(res.body).toHaveProperty('porFabricante')
    expect(res.body).toHaveProperty('ultimaSemana')
  })

  it('usuário comum só vê aeronaves que cadastrou', async () => {
    await request(app)
      .post('/aeronaves')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleAircraft)

    await request(app).post('/auth/register').send({
      nome: 'Outro User',
      email: 'outro@test.com',
      senha: 'senha123',
      role: 'user',
    })
    const outroLogin = await request(app).post('/auth/login').send({
      email: 'outro@test.com',
      senha: 'senha123',
    })
    const outroToken = outroLogin.body.token

    const vazio = await request(app)
      .get('/aeronaves')
      .set('Authorization', `Bearer ${outroToken}`)

    expect(vazio.status).toBe(200)
    expect(vazio.body.data).toHaveLength(0)

    const adminLista = await request(app)
      .get('/aeronaves')
      .set('Authorization', `Bearer ${token}`)

    expect(adminLista.body.data.length).toBeGreaterThanOrEqual(1)
  })

  it('DELETE /aeronaves/:id exige admin', async () => {
    const created = await request(app)
      .post('/aeronaves')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleAircraft)

    const userReg = await request(app).post('/auth/register').send({
      nome: 'User',
      email: 'useronly@test.com',
      senha: 'senha123',
      role: 'user',
    })
    const userLogin = await request(app).post('/auth/login').send({
      email: 'useronly@test.com',
      senha: 'senha123',
    })
    const userToken = userLogin.body.token

    const denied = await request(app)
      .delete(`/aeronaves/${created.body.id}`)
      .set('Authorization', `Bearer ${userToken}`)

    expect(denied.status).toBe(403)

    const ok = await request(app)
      .delete(`/aeronaves/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(ok.status).toBe(200)
  })
})
