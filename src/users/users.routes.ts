import { Router } from 'express'

import UsersController from './users.controller'

const userRouter = Router()
const usersController = new UsersController()

userRouter.get('/users', usersController.getAll)
userRouter.get('/users/:id', usersController.getOne)
userRouter.post('/users', usersController.add)
userRouter.put('/users/:id', usersController.updateOne)
userRouter.delete('/users/:id', usersController.deleteOne)

export default userRouter