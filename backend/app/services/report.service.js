const Aircraft = require('../models/Aircraft')
const { getOwnerFilter } = require('../utils/ownerFilter')

function matchStage(user) {
  const filter = getOwnerFilter(user)
  return Object.keys(filter).length ? [{ $match: filter }] : []
}

async function countNaoVendidas(user) {
  return Aircraft.countDocuments({
    vendido: false,
    ...getOwnerFilter(user),
  })
}

async function porDecada(user) {
  const rows = await Aircraft.aggregate([
    ...matchStage(user),
    {
      $group: {
        _id: { $subtract: ['$ano', { $mod: ['$ano', 10] }] },
        quantidade: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, decada: '$_id', quantidade: 1 } },
  ])
  return rows
}

async function porFabricante(user) {
  const rows = await Aircraft.aggregate([
    ...matchStage(user),
    { $group: { _id: '$marca', quantidade: { $sum: 1 } } },
    { $sort: { quantidade: -1 } },
    { $project: { _id: 0, fabricante: '$_id', quantidade: 1 } },
  ])
  return rows
}

async function ultimaSemana(user) {
  const semanaAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return Aircraft.countDocuments({
    createdAt: { $gte: semanaAtras },
    ...getOwnerFilter(user),
  })
}

async function dashboard(user) {
  const [naoVendidas, porDecadaRows, porFabricanteRows, ultimaSemanaCount] =
    await Promise.all([
      countNaoVendidas(user),
      porDecada(user),
      porFabricante(user),
      ultimaSemana(user),
    ])

  return {
    naoVendidas,
    porDecada: porDecadaRows,
    porFabricante: porFabricanteRows,
    ultimaSemana: ultimaSemanaCount,
  }
}

module.exports = {
  countNaoVendidas,
  porDecada,
  porFabricante,
  ultimaSemana,
  dashboard,
}
