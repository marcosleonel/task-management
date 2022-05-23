import UsersUseCases from '../users.useCases'
import type { UserData, UserRepositoryResults} from '../users.types'

describe('Users Use Cases', () => {
  let useCases
  let repositoryMock
  let identifiers

  beforeAll(() => {
    identifiers = ['6f6ccbf3-75e4-47e3-ac1d-fe38fc7f5dea']
    repositoryMock = {
      create: (data: UserData): Promise<UserRepositoryResults> => {
        return Promise.resolve({
          success: !!(data.email && data.password),
          data: identifiers, 
        })
      },
      findAll: (): Promise<UserRepositoryResults> => {
        return Promise.resolve({
          success: true,
          data: [{ ultimateQuestion: 42 }], 
        })
      },
      findById: (id: string): Promise<UserRepositoryResults> => {
        return Promise.resolve({
          success: true,
          data: { 
            id: id,
            email: 'paperm@rio.com',
            password: '123qwe!@#QWE'
          }, 
        })
      },
      updateById: (data: UserData): Promise<UserRepositoryResults> => {
        return Promise.resolve({
          success: true,
          data: { email: data.email }, 
        })
      },
      deleteById: (id: string): Promise<UserRepositoryResults> =>{
        return Promise.resolve({
          success: true,
          data: { id: id }, 
        })
      }
    }
    useCases = new UsersUseCases(repositoryMock)
  })

  it('should return success status and data when add user', async () => {
    const userData: UserData = {
      email: 'zelda@link.com',
      password: 'Occarina0fT!ME'
    }
    const result = await useCases.addUser(userData)

    expect(result.success).toBe(true)
    expect(result.data).toBe(identifiers)
  })

  it('should return a list of users', async () => {
    const result = await useCases.listUsers()

    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(1)
  })

  it('should return an user by ID', async () => {
    const result = await useCases.getUser(identifiers[0])

    expect(result.success).toBe(true)
    expect(result.data).toHaveProperty('id')
    expect(result.data).toHaveProperty('email')
    expect(result.data).toHaveProperty('password')
  })

  it('should return success status and data when update user', async () => {
    const userData: UserData = {
      email: 'zelda@link.com',
      password: 'Occarina0fT!ME'
    }
    const result = await useCases.updateUser(userData)

    expect(result.success).toBe(true)
    expect(result.data).toHaveProperty('email')
  })

  it('should return success status and data when delete user', async () => {
    const userData: UserData = {
      email: 'zelda@link.com',
      password: 'Occarina0fT!ME'
    }
    const result = await useCases.updateUser(userData)

    expect(result.success).toBe(true)
    expect(result).toHaveProperty('data')
  })
})
