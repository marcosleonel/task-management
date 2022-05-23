import bcrypt from 'bcrypt'
import {
  IUsersRepository,
  IUserUseCases,
  UserData,
  UserRepositoryResults
} from './users.types'
import Users from './users.entity'

class UsersUseCases implements IUserUseCases {
  readonly userRepository: IUsersRepository

  constructor(repository: IUsersRepository) {
    this.userRepository = repository
  }

  async addUser (userData: UserData): Promise<UserRepositoryResults> {
    const newUser = new Users(userData.email as string, userData.password as string)
    const validation = newUser.validate()

    if (validation.errors.length) return validation

    try {
      userData.password = await bcrypt.hash(userData.password, 10)

      const { data, success } = await this.userRepository.create(userData)

      if (!success) throw new Error('[UsersUseCases.addUser] Unable to add user.')

      return { success, data }
    } catch (error: unknown) {
      return {
        success: false,
        error,
        data: null
      }
    }
  }

  async listUsers (): Promise<UserRepositoryResults> {
    try {
      const { data, success } = await this.userRepository.findAll()

      if (!success) throw new Error(`[UsersUseCases.listUsers] Unable to get the list of users. Data: \n ${data}\n Succes: \n ${success}`)

      return { success, data }
    } catch(error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }
  
  async getUser (id: string): Promise<UserRepositoryResults> {
    try {
      const { data, success } = await this.userRepository.findById(id)

      if (!success) throw new Error('[UsersUseCases.getUser] Unable to get user')

      return { success, data }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async getUserByEmail (email: string): Promise<UserRepositoryResults> {
    try {
      const { data, success } = await this.userRepository.findByEmail(email)

      if (!success) throw new Error('[UsersUseCases.getUserByEmail] Unable to get user')

      return { success, data }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async updateUser (userData: UserData): Promise<UserRepositoryResults> {
    try {
      const { data, success } = await this.userRepository.updateById(userData)
      
      if (!success) throw new Error('[UsersUseCases.updateUser] Unable to get the list of users')

      return { success, data }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async deleteUser (id: string): Promise<UserRepositoryResults> {
    try {
      const { data, success } = await this.userRepository.deleteById(id)

      if (!success) throw new Error('[UsersUseCases.updateUser] Unable to delete user')

      return { success, data }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async comparePassword (receivedPassword, storedPassword): Promise<UserRepositoryResults> {
    try {
      if (!receivedPassword) throw new Error('[UserUseCases.comparePassword] received password missing')
      if (!storedPassword) throw new Error('[UserUseCases.comparePassword] stored missing')

      const success = await bcrypt.compare(receivedPassword, storedPassword)

      if (!success) throw new Error('[UserUseCases.comparePassword] user not found')

      return {
        success,
        data: {
          receivedPassword,
          storedPassword
        }
      }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }
}

export default UsersUseCases
