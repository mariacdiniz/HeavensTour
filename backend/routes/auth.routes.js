const { Router } = require('express')
const authController = require('../app/controllers/auth.controller')
const { validate } = require('../app/middlewares/validate.middleware')
const { registerSchema, loginSchema } = require('../app/schemas/auth.schema')

const router = Router()

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)

module.exports = router
