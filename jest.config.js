module.exports = {
  bail: true, // se 1 teste falhar interrompe todos os testes
  coverageProvider: 'v8',
  testMatch: ['<rootDir>/src/**/*.spec.js'], // determinar o local dos arquivos que contém os testes (elimina a node modules)
  clearMocks: true
}
