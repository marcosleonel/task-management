import { Router } from 'express'

import { jwtAuthenticate } from '../helpers/jwt-authenticate'
import UsersController from './users.controller'

const userRouter = Router()
const usersController = new UsersController()

userRouter.get('/users', jwtAuthenticate, usersController.getAll)
userRouter.get('/users/:id', jwtAuthenticate, usersController.getOne)
userRouter.post('/users', usersController.add)
userRouter.put('/users/:id', jwtAuthenticate, usersController.updateOne)
userRouter.delete('/users/:id', jwtAuthenticate, usersController.deleteOne)

userRouter.post('/users/login', usersController.login)

export default userRouter