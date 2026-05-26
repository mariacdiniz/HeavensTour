const reportService = require('../services/report.service')

async function naoVendidas(req, res) {
  const total = await reportService.countNaoVendidas(req.user)
  res.json({ naoVendidas: total })
}

async function porDecada(req, res) {
  const porDecada = await reportService.porDecada(req.user)
  res.json({ porDecada })
}

async function porFabricante(req, res) {
  const porFabricante = await reportService.porFabricante(req.user)
  res.json({ porFabricante })
}

async function ultimaSemana(req, res) {
  const ultimaSemana = await reportService.ultimaSemana(req.user)
  res.json({ ultimaSemana })
}

async function dashboard(req, res) {
  const data = await reportService.dashboard(req.user)
  res.json(data)
}

module.exports = { naoVendidas, porDecada, porFabricante, ultimaSemana, dashboard }
