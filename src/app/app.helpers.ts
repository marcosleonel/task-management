import session from 'express-session'
import { NextFunction, Request, Response } from 'express'
import { Strategy as LocalStrategy } from 'passport-local'
import logger from '../logger'

const MemoryStore = require('memorystore')(session)

const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  return session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.JWT_SECRET ?? 'fallback'
  })(req, res, next)
}


const configPassport = async (passportInstance, usersUseCases, comparePassword, generateToken) => {
  passportInstance.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          const user = await usersUseCases.getUserByEmail(email)
          const { success } = await comparePassword(password, user.data.password)

          if (!success) done(null, false)

          user.token = generateToken(user.data.id, process.env.JWT_SECRET)
          done(null, user)
        } catch (error: unknown) {
          logger.error(`[configPassport]: ${error}`)
          done(null, false)
        }
      }
    )
  )

  passportInstance.serializeUser((user: any, done) => {
    done(null, user)
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
