const authService = require('../../services/auth.service')

async function registerUseCase(data) {
  return authService.register(data)
}

module.exports = { registerUseCase }
