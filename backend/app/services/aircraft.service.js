const Aircraft = require('../models/Aircraft')
const env = require('../../config/env')
const { mergeOwnerFilter } = require('../utils/ownerFilter')

function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return url
  if (url.startsWith('/uploads')) return url

  const internal = env.aws.endpoint?.replace(/\/$/, '')
  const publicBase = env.aws.publicEndpoint?.replace(/\/$/, '')
  if (internal && publicBase && url.startsWith(internal)) {
    return url.replace(internal, publicBase)
  }

  return url.replace(/:\/\/localstack:/gi, '://localhost:')
}

function toResponse(doc) {
  const obj = doc.toObject ? doc.toObject() : doc
  return {
    id: obj._id.toString(),
    nome: obj.nome,
    marca: obj.marca,
    ano: obj.ano,
    descricao: obj.descricao,
    vendido: obj.vendido,
    icaoCode: obj.icaoCode,
    capacidadeCombustivel: obj.capacidadeCombustivel,
    consumoMedio: obj.consumoMedio,
    autonomiaKm: obj.autonomiaKm,
    categoriaAutonomia: obj.categoriaAutonomia,
    imagemUrl: normalizeImageUrl(obj.imagemUrl),
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  }
}

async function list({ user, page = 1, limit = 10 } = {}) {
  const query = mergeOwnerFilter({}, user)
  const skip = (page - 1) * limit
  const [data, total] = await Promise.all([
    Aircraft.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Aircraft.countDocuments(query),
  ])
  return {
    data: data.map(toResponse),
    total,
    page,
    limit,
  }
}

async function search(filters, user) {
  const {
    nome,
    marca,
    ano,
    decada,
    vendido,
    categoriaAutonomia,
    createdFrom,
    createdTo,
    page = 1,
    limit = 10,
  } = filters

  const query = {}

  if (nome) query.nome = { $regex: nome, $options: 'i' }
  if (marca) query.marca = marca
  if (ano) query.ano = ano
  if (decada) {
    query.ano = { $gte: decada, $lte: decada + 9 }
  }
  if (vendido !== undefined) query.vendido = vendido
  if (categoriaAutonomia) query.categoriaAutonomia = categoriaAutonomia
  if (createdFrom || createdTo) {
    query.createdAt = {}
    if (createdFrom) query.createdAt.$gte = new Date(createdFrom)
    if (createdTo) query.createdAt.$lte = new Date(createdTo)
  }

  const scopedQuery = mergeOwnerFilter(query, user)
  const skip = (page - 1) * limit
  const [data, total] = await Promise.all([
    Aircraft.find(scopedQuery).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Aircraft.countDocuments(scopedQuery),
  ])

  return { data: data.map(toResponse), total, page, limit }
}

async function getById(id, user) {
  const aircraft = await Aircraft.findOne(mergeOwnerFilter({ _id: id }, user))
  if (!aircraft) {
    const err = new Error('Aeronave não encontrada')
    err.statusCode = 404
    throw err
  }
  return toResponse(aircraft)
}

async function create(body, user) {
  try {
    const aircraft = await Aircraft.create({
      ...body,
      criadoPor: user.id,
    })
    return toResponse(aircraft)
  } catch (err) {
    if (err.code === 11000) {
      const e = new Error('ICAO já cadastrado')
      e.statusCode = 409
      throw e
    }
    throw err
  }
}

async function update(id, body, user) {
  try {
    const aircraft = await Aircraft.findOneAndUpdate(
      mergeOwnerFilter({ _id: id }, user),
      { $set: body },
      { new: true, runValidators: true },
    )
    if (!aircraft) {
      const err = new Error('Aeronave não encontrada')
      err.statusCode = 404
      throw err
    }
    return toResponse(aircraft)
  } catch (err) {
    if (err.code === 11000) {
      const e = new Error('ICAO já cadastrado')
      e.statusCode = 409
      throw e
    }
    throw err
  }
}

async function remove(id, user) {
  const aircraft = await Aircraft.findOneAndDelete(
    mergeOwnerFilter({ _id: id }, user),
  )
  if (!aircraft) {
    const err = new Error('Aeronave não encontrada')
    err.statusCode = 404
    throw err
  }
  return toResponse(aircraft)
}

async function setImageUrl(id, imagemUrl, user) {
  const aircraft = await Aircraft.findOneAndUpdate(
    mergeOwnerFilter({ _id: id }, user),
    { imagemUrl },
    { new: true },
  )
  if (!aircraft) {
    const err = new Error('Aeronave não encontrada')
    err.statusCode = 404
    throw err
  }
  return toResponse(aircraft)
}

module.exports = {
  list,
  search,
  getById,
  create,
  update,
  remove,
  setImageUrl,
  toResponse,
}
