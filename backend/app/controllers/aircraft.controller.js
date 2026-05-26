const aircraftService = require('../services/aircraft.service')
const uploadService = require('../services/upload.service')

async function list(req, res) {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const result = await aircraftService.list({ user: req.user, page, limit })
  res.json(result)
}

async function search(req, res) {
  const result = await aircraftService.search(req.validated, req.user)
  res.json(result)
}

async function getById(req, res) {
  const result = await aircraftService.getById(req.params.id, req.user)
  res.json(result)
}

async function create(req, res) {
  const result = await aircraftService.create(req.validated, req.user)
  res.status(201).json(result)
}

async function update(req, res) {
  const result = await aircraftService.update(
    req.params.id,
    req.validated,
    req.user,
  )
  res.json(result)
}

async function remove(req, res) {
  const result = await aircraftService.remove(req.params.id, req.user)
  res.json(result)
}

async function upload(req, res) {
  const result = await uploadService.uploadAircraftImage(
    req.params.id,
    req.file,
    req.user,
  )
  res.json(result)
}

module.exports = { list, search, getById, create, update, remove, upload }
