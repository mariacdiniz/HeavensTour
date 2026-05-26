const authService = require('../../services/auth.service')

async function loginUseCase(data) {
  return authService.login(data)
}

module.exports = { loginUseCase }
