import { Router } from 'express'

import { jwtAuthenticate } from '../helpers/jwt-authenticate'
import TasksController from './tasks.controller'

const tasksRouter = Router()
const tasksController = new TasksController()

tasksRouter.get('/tasks', jwtAuthenticate, tasksController.getAll)
tasksRouter.get('/tasks/:id', jwtAuthenticate, tasksController.getOne)
tasksRouter.post('/tasks', tasksController.add)
tasksRouter.put('/tasks/:id', jwtAuthenticate, tasksController.updateOne)
tasksRouter.delete('/tasks/:id', jwtAuthenticate, tasksController.deleteOne)

export default tasksRouter