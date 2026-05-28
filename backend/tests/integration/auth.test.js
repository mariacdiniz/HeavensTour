const request = require('supertest')
const { buildApp } = require('../../app/factory')

let app

beforeAll(() => {
  app = buildApp()
})

describe('Auth API', () => {
  it('POST /auth/register cria usuário', async () => {
    const res = await request(app).post('/auth/register').send({
      nome: 'Test User',
      email: 'test@heavenstour.com',
      senha: 'senha123',
      role: 'user',
    })

    expect(res.status).toBe(201)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.email).toBe('test@heavenstour.com')
  })

  it('POST /auth/login retorna JWT', async () => {
    await request(app).post('/auth/register').send({
      nome: 'Login User',
      email: 'login@heavenstour.com',
      senha: 'senha123',
    })

    const res = await request(app).post('/auth/login').send({
      email: 'login@heavenstour.com',
      senha: 'senha123',
    })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
  })

  it('POST /auth/register ignora role admin no body', async () => {
    const res = await request(app).post('/auth/register').send({
      nome: 'Hacker',
      email: 'hacker@heavenstour.com',
      senha: 'senha123',
      role: 'admin',
    })

    expect(res.status).toBe(201)
    expect(res.body.user.role).toBe('user')
  })

  it('POST /auth/login com password (alias front)', async () => {
    await request(app).post('/auth/register').send({
      nome: 'Alias',
      email: 'alias@heavenstour.com',
      password: 'senha123',
    })

    const res = await request(app).post('/auth/login').send({
      email: 'alias@heavenstour.com',
      password: 'senha123',
    })

    expect(res.status).toBe(200)
  })
})
