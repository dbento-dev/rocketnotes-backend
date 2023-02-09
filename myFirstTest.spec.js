// Na função it() o primeiro parâmetro é recebe uma breve descrição do tipo de teste a ser realizado.
// Na função it() o segundo parâmetro é a função que será executada.

it('result of the sum of 2 + 2 must be 4', () => {
  const a = 2
  const b = 2
  const result = a + b

  expect(result).toEqual(4) // expectativa de que o resultado do teste seja igual a 4
})
