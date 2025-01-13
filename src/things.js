export const sum = (...args) => args.reduce((a, b) => a + b, 0)

export const removeVowels = (text) => text.replace(/[aeiou]/gi, '')

export const calculateTax = (price) => {
  if (price > 1000) return price * 0.2

  return price * 0.1
}

export const countVowels = (text) => text.match(/[aeiou]/gi)?.length || 0
