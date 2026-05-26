const { normalizeManufacturer } = require('../../app/utils/manufacturer')

describe('normalizeManufacturer', () => {
  it('normaliza casing', () => {
    expect(normalizeManufacturer('boeing')).toBe('Boeing')
    expect(normalizeManufacturer(' BOEING ')).toBe('Boeing')
  })

  it('rejeita fabricante desconhecido', () => {
    expect(() => normalizeManufacturer('FakeBrand')).toThrow(/Fabricante inválido/)
  })
})
