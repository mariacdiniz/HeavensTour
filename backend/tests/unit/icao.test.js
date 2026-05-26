const { validateIcaoCode } = require('../../app/utils/icao')

describe('validateIcaoCode', () => {
  it('aceita B738 para Boeing', () => {
    expect(validateIcaoCode('B738', 'Boeing')).toBe('B738')
  })

  it('aceita E175 para Embraer', () => {
    expect(validateIcaoCode('E175', 'Embraer')).toBe('E175')
  })

  it('rejeita ICAO com inicial errada', () => {
    expect(() => validateIcaoCode('E175', 'Boeing')).toThrow(
      /Primeira letra do ICAO/,
    )
  })

  it('rejeita código com tamanho inválido', () => {
    expect(() => validateIcaoCode('B73', 'Boeing')).toThrow(/4 caracteres/)
  })
})
