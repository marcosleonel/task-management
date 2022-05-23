import session from 'express-session'
import { NextFunction, Request, Response } from 'express'

const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })(req, res, next)
}

export { sessionMiddleware }