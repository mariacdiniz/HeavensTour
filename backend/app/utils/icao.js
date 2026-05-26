const ICAO_REGEX = /^[A-Z0-9]{4}$/

function validateIcaoCode(icaoCode, marca) {
  const code = icaoCode.toUpperCase().trim()

  if (!ICAO_REGEX.test(code)) {
    const err = new Error('ICAO deve ter 4 caracteres alfanuméricos (ex: B738)')
    err.statusCode = 400
    throw err
  }

  const expectedInitial = marca.trim().charAt(0).toUpperCase()
  if (code.charAt(0) !== expectedInitial) {
    const err = new Error(
      `Primeira letra do ICAO deve ser "${expectedInitial}" (inicial de ${marca})`,
    )
    err.statusCode = 400
    throw err
  }

  return code
}

module.exports = { validateIcaoCode, ICAO_REGEX }
