const MANUFACTURERS = [
  'Airbus',
  'Boeing',
  'Bombardier',
  'Embraer',
  'Lockheed Martin',
]

function normalizeManufacturer(marca) {
  const trimmed = marca.trim()
  const found = MANUFACTURERS.find(
    (m) => m.toLowerCase() === trimmed.toLowerCase(),
  )
  if (!found) {
    const err = new Error(
      `Fabricante inválido. Use um dos valores: ${MANUFACTURERS.join(', ')}`,
    )
    err.statusCode = 400
    throw err
  }
  return found
}

module.exports = { normalizeManufacturer, MANUFACTURERS }
