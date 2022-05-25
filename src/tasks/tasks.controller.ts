import type { Request, Response } from 'express'

import type { ITasksController } from './'
import {
  TaskUseCases,
  TasksTypeOrmAdapter
} from './'
import logger from '../logger'

class TaskController implements ITasksController {
  readonly useCases: TaskUseCases

  constructor() {
    this.useCases = new TaskUseCases(new TasksTypeOrmAdapter())
  }

  async add (req: Request, res: Response) {
    if (!req.body) {
      return res.status(400).json({ message: 'body is required' })
    }

    if (!req.body.description || !req.body.isDone) {
      return res.status(400).json({ message: 'description and isDone are required' })
    }

    try {
      const { description, isDone } = req.body
      const useCases = new TaskUseCases(new TasksTypeOrmAdapter())
      const { success } = await useCases.getTaskByDescription(description)

      if (success) return res.status(409).json({ message: 'This task already exists'})

      const result = await useCases.addTask({ description, isDone })

      if (result.error) throw new Error(`${result.error}`)

      return res.status(201).json({ message: 'Task created' })
    } catch (error: unknown) {
      logger.error('[tasksController.add]: ', error)
      return res.status(500).json({ message: 'An internal error occured' })
    }
  }

  async getAll (_, res: Response) {
    try {
      const useCases = new TaskUseCases(new TasksTypeOrmAdapter())
      const result = await useCases.listTasks()

      if (result.error) throw new Error(`${result.error}`)

      return res.status(200).json(result)
    } catch (error: unknown) {
      logger.error(`[tasksController.getAll]: ${error}`)
      return res.status(500).json({ message: 'An internal error occured' })
    }
  }

  async getOne (req: Request, res: Response) {
    try {
      const { id } = req.params
      const useCases = new TaskUseCases(new TasksTypeOrmAdapter())
      const result = await useCases.getTask(id)

      if (result.error) throw new Error(`${result.error}`)

      return res.status(200).json(result)
    } catch (error: unknown) {
      logger.error(`[tasksController.getOne]: ${error}`)
      return res.status(500).json({ message: 'An internal error occured' })
    }
  }

  async updateOne (req: Request, res: Response) {
    if (!req.body) {
      return res.status(400).json({ message: 'body is required' })
    }

    if (!req.body.description || !req.body.isDone) {
      return res.status(400).json({ message: 'description and isDone are required' })
    }

    try {
      const { id, description, isDone } = req.body
      const userData = { id, description, isDone }
      const useCases = new TaskUseCases(new TasksTypeOrmAdapter())
      const result = await useCases.updateTask(userData)

      if (result.error) throw new Error(`${result.error}`)

      return res.status(202).json({ message: 'Task updated' })
    } catch (error: unknown) {
      logger.error(`[tasksController.updateOne]: ${error}`)
      return res.status(500).json({ message: 'An internal error occured' })
    }
  }

  async deleteOne (req: Request, res: Response) {
    try {
      const { id } = req.params
      const useCases = new TaskUseCases(new TasksTypeOrmAdapter())
      const result = await useCases.deleteTask(id)

      if (result.error) throw new Error(`${result.error}`)

      return res.status(202).json({ message: 'Task deleted' })
    } catch (error: unknown) {
      logger.error(`[tasksController.deleteOne]: ${error}`)
      return res.status(500).json({ message: 'An internal error occured' })
    }
  }
}

export default TaskController