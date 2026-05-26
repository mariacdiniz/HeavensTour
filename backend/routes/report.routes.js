const { Router } = require('express')
const reportController = require('../app/controllers/report.controller')
const { authMiddleware } = require('../app/middlewares/auth.middleware')

const router = Router()

router.use(authMiddleware)

router.get('/nao-vendidas', reportController.naoVendidas)
router.get('/por-decada', reportController.porDecada)
router.get('/por-fabricante', reportController.porFabricante)
router.get('/ultima-semana', reportController.ultimaSemana)
router.get('/dashboard', reportController.dashboard)

module.exports = router
