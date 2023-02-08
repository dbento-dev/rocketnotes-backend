const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class UserController {
  /* 
    BOAS PRÁTICAS: cada controller pode ter até 5 métodos, caso exista a necessidade de mais, vale a pena dividir as responsabilidades para manter um controle maior e ter mais clareza.

    Sendo assim, teremos: 
      index - GET para listar vários registros
      show - GET para exibir um registro especifico.
      create - POST para criar um registro
      update - PUT para atualizar um registro especifico
      delete - DELETE para apagar um registro especifico
  */

  async create(req, res) {
    const { name, email, password } = req.body

    const database = await sqliteConnection()

    const checkUserExists = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )

    if (checkUserExists) {
      throw new AppError('Email already exists')
    }

    const hashedPassword = await hash(password, 8)

    await database.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )

    return res.status(201).json()
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body
    const user_id = req.user.id
    const database = await sqliteConnection()
    const user = await database.get('SELECT * FROM users WHERE id = (?)', [
      user_id
    ])

    if (!user) {
      throw new AppError('User not found')
    }

    const userWithUpdatedEmail = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('User with updated email already exists')
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (password && !old_password) {
      throw new AppError('Old password is required')
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError(
          'Old password is incorrect, please check your old password'
        )
      }

      user.password = await hash(password, 8)
    }

    await database.run(
      `UPDATE users SET name = (?), email = (?), password = (?), updated_at = DATETIME('now') WHERE id = (?)`,
      [user.name, user.email, user.password, user_id]
    )

    return res.status(200).json()
  }
}

module.exports = UserController
