import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import type { UserData, UserRepositoryResults } from './users.types'

const generateToken = (user: UserData, secret: string): string => {
  if (!user) throw new Error('[generateToken] user data is required')
  if (!secret) throw new Error('[generateToken] secret is required')

  delete user.password

  return jwt.sign(user, secret, { expiresIn: '24 hours'})
}

const comparePassword = async (receivedPassword: string, storedPassword: string): Promise<UserRepositoryResults> => {
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

export {
  comparePassword,
  generateToken
}
