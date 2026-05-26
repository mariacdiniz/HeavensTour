function calculateAutonomyKm(capacidadeCombustivel, consumoMedio) {
  return capacidadeCombustivel * consumoMedio
}

function getAutonomyCategory(autonomiaKm) {
  if (autonomiaKm <= 3000) return 'Curta'
  if (autonomiaKm <= 7000) return 'Média'
  return 'Longa'
}

function applyAutonomyFields(doc) {
  const autonomiaKm = calculateAutonomyKm(
    doc.capacidadeCombustivel,
    doc.consumoMedio,
  )
  doc.autonomiaKm = autonomiaKm
  doc.categoriaAutonomia = getAutonomyCategory(autonomiaKm)
  return doc
}

module.exports = {
  calculateAutonomyKm,
  getAutonomyCategory,
  applyAutonomyFields,
}
