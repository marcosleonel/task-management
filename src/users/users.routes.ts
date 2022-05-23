import { Router } from 'express'
import passport from 'passport'

import UsersController from './users.controller'

const userRouter = Router()
const usersController = new UsersController()

userRouter.get('/users', usersController.getAll)
userRouter.get('/users/:id', usersController.getOne)
userRouter.post('/users', usersController.add)
userRouter.put('/users/:id', usersController.updateOne)
userRouter.delete('/users/:id', usersController.deleteOne)

userRouter.post(
  '/users/login',
  passport.authenticate('local', { failureRedirect: '/healthy', failureMessage: true }),
  usersController.login
)

export default userRouter