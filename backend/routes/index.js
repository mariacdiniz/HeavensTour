const { Router } = require('express')
const authRoutes = require('./auth.routes')
const aircraftRoutes = require('./aircraft.routes')
const reportRoutes = require('./report.routes')

const router = Router()

router.get('/', (req, res) => {
  res.json({
    name: 'HeavensTour API',
    version: '1.0.0',
    description: 'API REST para gestão de aeronaves',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    status: 'online',
    timestamp: new Date().toISOString(),
  })
})

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'heavens-tour-api' })
})

router.use('/auth', authRoutes)
router.use('/aeronaves', aircraftRoutes)
router.use('/relatorios', reportRoutes)

module.exports = router
