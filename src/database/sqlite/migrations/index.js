const sqliteConnection = require('../../sqlite')
const createUsers = require('./createUsers')

async function migrationsRun(user) {
  const schemas = [createUsers].join('')

  sqliteConnection()
    .then((db) => db.exec(schemas))
    .catch((error) => console.log('Error:', error))
}

module.exports = migrationsRun
