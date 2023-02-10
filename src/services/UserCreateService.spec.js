const AppError = require('../utils/AppError')

const UserCreateService = require('./UserCreateService')
const UserRepositoryInMemory = require('../repositories/UserRepositoryInMemory')

describe('UserCreateService', () => {
  let userRepositoryInMemory = null
  let userCreateService = null

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    userCreateService = new UserCreateService(userRepositoryInMemory)
  })

  it('user should be create', async () => {
    const user = {
      name: 'User Test',
      email: 'user@teste.com',
      password: '123456'
    }

    const userCreated = await userCreateService.execute(user)
    expect(userCreated).toHaveProperty('id')
  })

  it('user should not be create', async () => {
    const user = {
      name: 'User Test',
      email: 'user@teste.com',
      password: '123456'
    }

    const user2 = {
      name: 'User Test2',
      email: 'user@teste.com',
      password: '123456'
    }

    await userCreateService.execute(user)
    await expect(userCreateService.execute(user2)).rejects.toEqual(
      new AppError('Email já está cadastrado!')
    )
  })
})
