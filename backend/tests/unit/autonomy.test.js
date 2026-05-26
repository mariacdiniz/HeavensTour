const {
  calculateAutonomyKm,
  getAutonomyCategory,
} = require('../../app/utils/autonomy')

describe('autonomia', () => {
  it('calcula autonomia = capacidade × consumo', () => {
    expect(calculateAutonomyKm(10000, 0.15)).toBe(1500)
  })

  it('categoriza Curta até 3000', () => {
    expect(getAutonomyCategory(3000)).toBe('Curta')
    expect(getAutonomyCategory(2999)).toBe('Curta')
  })

  it('categoriza Média entre 3000 e 7000', () => {
    expect(getAutonomyCategory(3001)).toBe('Média')
    expect(getAutonomyCategory(7000)).toBe('Média')
  })

  it('categoriza Longa acima de 7000', () => {
    expect(getAutonomyCategory(7001)).toBe('Longa')
  })
})
