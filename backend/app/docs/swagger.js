const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'HeavensTour API',
    version: '1.0.0',
    description: `
## Autenticação

Esta API usa **JWT Bearer Token**.

**Como autenticar:**
1. Crie uma conta em \`POST /auth/register\`
2. Faça login em \`POST /auth/login\` — copie o \`token\` da resposta
3. Clique em **Authorize** (cadeado 🔒) no topo desta página
4. Digite: \`Bearer SEU_TOKEN_AQUI\`
5. Clique em **Authorize** e feche o modal
6. Agora todas as rotas protegidas funcionarão normalmente
    `,
  },
  servers: [{ url: 'http://localhost:3333', description: 'Desenvolvimento' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token JWT no formato: Bearer {token}',
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/': {
      get: {
        summary: 'Informações da API',
        description: 'Metadados e link para documentação interativa',
        tags: ['Sistema'],
        security: [],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/health': {
      get: {
        summary: 'Health check',
        tags: ['Sistema'],
        security: [],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Registrar usuário',
        tags: ['Auth'],
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  email: { type: 'string' },
                  senha: { type: 'string' },
                  role: { type: 'string', enum: ['user', 'admin'] },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Criado' } },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Autenticar usuário',
        tags: ['Auth'],
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  senha: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Token JWT' } },
      },
    },
    '/aeronaves': {
      get: {
        summary: 'Listar aeronaves',
        description:
          'Retorna lista paginada. Requer autenticação — use o botão Authorize 🔒',
        tags: ['Aeronaves'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Lista' }, 401: { description: 'Não autenticado' } },
      },
      post: {
        summary: 'Criar aeronave',
        description: 'Cadastra nova aeronave vinculada ao usuário autenticado',
        tags: ['Aeronaves'],
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Criada' }, 401: { description: 'Não autenticado' } },
      },
    },
    '/aeronaves/search': {
      get: {
        summary: 'Buscar aeronaves',
        description: 'Filtros combinados. Requer autenticação — use o botão Authorize 🔒',
        tags: ['Aeronaves'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Resultado' } },
      },
    },
    '/aeronaves/{id}': {
      get: {
        summary: 'Obter por ID',
        description: 'Requer autenticação — use o botão Authorize 🔒',
        tags: ['Aeronaves'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true }],
        responses: { 200: { description: 'OK' }, 404: { description: 'Não encontrada' } },
      },
      put: {
        summary: 'Atualizar aeronave',
        description: 'Requer autenticação — use o botão Authorize 🔒',
        tags: ['Aeronaves'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true }],
        responses: { 200: { description: 'OK' } },
      },
      delete: {
        summary: 'Remover aeronave (admin)',
        description: 'Apenas administradores. Requer autenticação — use o botão Authorize 🔒',
        tags: ['Aeronaves'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true }],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/aeronaves/{id}/upload': {
      post: {
        summary: 'Upload de imagem',
        description: 'Requer autenticação — use o botão Authorize 🔒',
        tags: ['Aeronaves'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  imagem: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'URL da imagem' } },
      },
    },
    '/relatorios/nao-vendidas': {
      get: {
        summary: 'Aeronaves não vendidas',
        description: 'Requer autenticação — use o botão Authorize 🔒',
        tags: ['Relatórios'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Total' } },
      },
    },
    '/relatorios/por-decada': {
      get: {
        summary: 'Distribuição por década',
        description: 'Requer autenticação — use o botão Authorize 🔒',
        tags: ['Relatórios'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Agregação' } },
      },
    },
    '/relatorios/por-fabricante': {
      get: {
        summary: 'Distribuição por fabricante',
        description: 'Requer autenticação — use o botão Authorize 🔒',
        tags: ['Relatórios'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Agregação' } },
      },
    },
    '/relatorios/ultima-semana': {
      get: {
        summary: 'Cadastros da última semana',
        description: 'Requer autenticação — use o botão Authorize 🔒',
        tags: ['Relatórios'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Total' } },
      },
    },
    '/relatorios/dashboard': {
      get: {
        summary: 'Dashboard agregado',
        description: 'Requer autenticação — use o botão Authorize 🔒',
        tags: ['Relatórios'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Relatórios' } },
      },
    },
  },
}

module.exports = swaggerDocument
