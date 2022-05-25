import { dataSource } from '../db';
import { UserData, UserRepositoryResults, IUsersRepository } from './users.types';
import { userSchema } from './users.schema';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

class UsersTypeOrmAdapter implements IUsersRepository {
  async create (userData: UserData): Promise<UserRepositoryResults> {
    try {
      const { email, password } = userData
      const userInserted: InsertResult = await dataSource
        .createQueryBuilder()
        .insert()
        .into(userSchema)
        .values([{ email: email as string, password: password as string}])
        .execute()
      const success: boolean = !!userInserted.identifiers

      if (!success) throw new Error('[UsersTypeOrmAdapter.create] Unable to create user')

      return {
        success,
        data: userInserted.identifiers
      }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async findAll (): Promise<UserRepositoryResults> {
    try {
      const usersFound = await dataSource
        .getRepository(userSchema)
        .createQueryBuilder('users')
        .getMany()
      const success: boolean = !!usersFound

      if (!success) throw new Error('[UsersTypeOrmAdapter.findAll] Unable to get the list of users')
      
      return {
        success,
        data: usersFound
      }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async findById (id: String): Promise<UserRepositoryResults> {
    try {
      const userFound = await dataSource
        .getRepository(userSchema)
        .createQueryBuilder('users')
        .where('id = :id', { id })
        .getOne()
      const success: boolean = !!(userFound && userFound.id)
      
      if (!success) throw new Error('[UsersTypeOrmAdapter.findById] Unable to get user')

      return {
        success,
        data: userFound
      }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async findByEmail (email: string): Promise<UserRepositoryResults> {
    try {
      const userFound = await dataSource
        .getRepository(userSchema)
        .createQueryBuilder('users')
        .where('email = :email', { email })
        .getOne()
      const success: boolean = !!(userFound && userFound.email === email)

      return {
        success,
        data: userFound
      }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async findBySubscriptionId (subscriptionId: string): Promise<UserRepositoryResults> {
    try {
      const userFound = await dataSource
        .getRepository(userSchema)
        .createQueryBuilder('users')
        .where('subscription_id = :subscriptionId', { subscriptionId })
        .getOne()
      const success: boolean = !!(userFound && userFound.id)

      return {
        success,
        data: userFound
      }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async updateById (userData: UserData): Promise<UserRepositoryResults> {
    try {
      const { email, password } = userData
      const queryResult: UpdateResult = await dataSource
        .createQueryBuilder()
        .update(userSchema)
        .set({ email: email as string, password: password as string })
        .where('id = :id', { id: userData.id })
        .execute()

      const success: boolean = !!queryResult.generatedMaps
      
      if (!success) throw new Error('[UsersTypeOrmAdapter.updateById] Unable to update user')
      
      return {
        success,
        data: queryResult.generatedMaps
      }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async deleteById (id: string): Promise<UserRepositoryResults> {
    try {
      const deleteResult: DeleteResult = await dataSource
        .createQueryBuilder()
        .delete()
        .from(userSchema)
        .where('id = :id', { id })
        .execute()

      const success: boolean = deleteResult.affected !== null
      
      return {
        success,
        data: deleteResult
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

export default UsersTypeOrmAdapter