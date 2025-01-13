import { sum, removeVowels, calculateTax, countVowels } from '../things.js'

describe('sum', () => {
  describe('when receive two numbers', () => {
    it('returns the sum of them', () => {
      expect(sum(1, 2)).toBe(3)
    })
  })

  describe('when receive four numbers', () => {
    it('returns the sum of them', () => {
      const result = sum(1, 2, 3, 4)
      expect(result).toBe(10)
    })
  })
})

describe('removeVowels', () => {
  it('removes all vowels from a string', () => {
    const result = removeVowels('hello world')
    expect(result).toBe('hll wrld')
  })
})

describe('calculateTax', () => {
  describe('when the price is greater than 1000', () => {
    it('returns 20% of the price', () => {
      const result = calculateTax(2000)
      expect(result).toBe(400)
    })
  })

  describe('when the price is less than 1000', () => {
    it('returns 10% of the price', () => {
      const result = calculateTax(900)
      expect(result).toBe(90)
    })
  })
})

describe('countVowels', () => {
  describe('when the text has vowels', () => {
    it('returns the number of vowels', () => {
      const result = countVowels('hello world')
      expect(result).toBe(3)
    })
  })

  describe('when the text has no vowels', () => {
    it('returns 0', () => {
      const result = countVowels('bcdfghjkl')
      expect(result).toBe(0)
    })
  })
})
