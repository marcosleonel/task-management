import type { Request, Response } from 'express'

import type { IUserController, UserData } from './users.types'
import UsersUseCases from './users.useCases'
import UsersTypeOrmRepository from './users.typeOrmRepository'
import logger from '../logger'
import { generateToken, comparePassword } from './users.helpers'

class UserController implements IUserController {
  readonly useCases: UsersUseCases

  constructor() {
    this.useCases = new UsersUseCases(new UsersTypeOrmRepository())
  }

  async add (req: Request, res: Response) {
    if (!req.body) {
      return res.status(400).json({ message: 'body is required' })
    }

    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'email and password are required' })
    }

    try {
      const { email, password } = req.body
      const useCases = new UsersUseCases(new UsersTypeOrmRepository())
      const { success } = await useCases.getUserByEmail(email)

      if (success) return res.status(409).json({ message: 'This e-mail was already registered'})

      const result = await useCases.addUser({ email, password })

      if (result.error) throw new Error(`${result.error}`)

      return res.status(201).json({ message: 'User created' })
    } catch (error: unknown) {
      logger.error('[userController.add]: ', error)
      return res.status(500).json({ message: 'An internal error occured' })
    }
  }

  async getAll (_, res: Response) {
    try {
      const useCases = new UsersUseCases(new UsersTypeOrmRepository())
      const result = await useCases.listUsers()

      if (result.error) throw new Error(`${result.error}`)

      return res.status(200).json(result)
    } catch (error: unknown) {
      logger.error(`[userController.getAll]: ${error}`)
      return res.status(500).json({ message: 'An internal error occured' })
    }
  }

  async getOne (req: Request, res: Response) {
    try {
      const { id } = req.params
      const useCases = new UsersUseCases(new UsersTypeOrmRepository())
      const result = await useCases.getUser(id)

      if (result.error) throw new Error(`${result.error}`)

      return res.status(200).json(result)
    } catch (error: unknown) {
      logger.error(`[userController.getOne]: ${error}`)
      return res.status(500).json({ message: 'An internal error occured' })
    }
  }

  async updateOne (req: Request, res: Response) {
    if (!req.body) {
      return res.status(400).json({ message: 'body is required' })
    }

    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'email and password are required' })
    }

    try {
      const { id, email, password } = req.body
      const userData = { id, email, password }
      const useCases = new UsersUseCases(new UsersTypeOrmRepository())
      const result = await useCases.updateUser(userData)

      if (result.error) throw new Error(`${result.error}`)

      return res.status(202).json({ message: 'User updated' })
    } catch (error: unknown) {
      logger.error(`[userController.updateOne]: ${error}`)
      return res.status(500).json({ message: 'An internal error occured' })
    }
  }

  async deleteOne (req: Request, res: Response) {
    try {
      const { id } = req.params
      const useCases = new UsersUseCases(new UsersTypeOrmRepository())
      const result = await useCases.deleteUser(id)

      if (result.error) throw new Error(`${result.error}`)

      return res.status(202).json({ message: 'User deleted' })
    } catch (error: unknown) {
      logger.error(`[userController.deleteOne]: ${error}`)
      return res.status(500).json({ message: 'An internal error occured' })
    }
  }

  async login (req: any, res: Response) {
    if (!req.body) {
      return res.status(400).json({ message: 'body is required' })
    }

    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'email and password are required' })
    } 
    
    try {
      const { email, password } = req.body
      const usersUseCases = new UsersUseCases(new UsersTypeOrmRepository())
      const result = await usersUseCases.getUserByEmail(email)

      if (!result.success) {
        return res.status(404).json({ message: 'The user or password is incorrect' })
      }

      const userData: UserData = result.data as UserData
      const { success } = await comparePassword(password, userData.password as string)

      if (!success) {
        return res.status(400).json({ message: 'The user or password is incorrect' })
      }

      const token = generateToken(userData, process.env.JWT_SECRET as string)

      return res.status(200).json({ ...userData, token })
    } catch (error: unknown) {
      logger.error(`[UserController.login]: ${error}`)
      return res.status(500).json({ message: 'An internal error occured' })
    }
  }
}

export default UserController