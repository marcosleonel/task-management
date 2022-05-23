import session from 'express-session'
import { NextFunction, Request, Response } from 'express'
import { Strategy as LocalStrategy } from 'passport-local'
import logger from '../logger'

const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })(req, res, next)
}

const configPassport = async (passportInstance, usersUseCases) => {
  passportInstance.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          const user = await usersUseCases.getUserByEmail(email)
          const { success } = await usersUseCases.comparePassword(password, user.data.password)

          if (!success) done(null, false)
    
          done(null, user)
        } catch (error: unknown) {
          logger.error(`[configPassport]: ${error}`)
          done(null, false)
        }
      }
    )
  )

  passportInstance.serializeUser((user: any, done) => {
    done(null, user.data.id)
  })

  passportInstance.deserializeUser(async (_, id: string, done: any) => {
    try {
      const user = await usersUseCases.getUser(id)
      done(null, user)
    } catch (error: unknown) {
      done(error)
    }
  })

  return passportInstance
}



export { configPassport, sessionMiddleware }