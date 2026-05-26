const { Router } = require('express')
const multer = require('multer')
const aircraftController = require('../app/controllers/aircraft.controller')
const { authMiddleware } = require('../app/middlewares/auth.middleware')
const { requireRole } = require('../app/middlewares/role.middleware')
const { validate } = require('../app/middlewares/validate.middleware')
const {
  aircraftBodySchema,
  searchQuerySchema,
} = require('../app/schemas/aircraft.schema')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
})

const router = Router()

router.use(authMiddleware)

router.get('/search', validate(searchQuerySchema, 'query'), aircraftController.search)
router.get('/', aircraftController.list)
router.get('/:id', aircraftController.getById)
router.post('/', validate(aircraftBodySchema), aircraftController.create)
router.put('/:id', validate(aircraftBodySchema), aircraftController.update)
router.delete('/:id', requireRole('admin'), aircraftController.remove)
router.post(
  '/:id/upload',
  upload.single('imagem'),
  aircraftController.upload,
)

module.exports = router
