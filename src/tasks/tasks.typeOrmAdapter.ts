import { dataSource } from '../db';
import { TaskData, TaskRepositoryResults, ITasksRepository } from './tasks.types';
import { taskSchema } from './tasks.schema';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

class TasksTypeOrmAdapter implements ITasksRepository {
  async create (taskData: TaskData): Promise<TaskRepositoryResults> {
    try {
      const { description, isDone } = taskData
      const taskInserted: InsertResult = await dataSource
        .createQueryBuilder()
        .insert()
        .into(taskSchema)
        .values([{ description: description as string, isDone: isDone as boolean}])
        .execute()
      const success: boolean = !!taskInserted.identifiers

      if (!success) throw new Error('[TasksTypeOrmAdapter.create] Unable to create task')

      return {
        success,
        data: taskInserted.identifiers
      }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async findAll (): Promise<TaskRepositoryResults> {
    try {
      const tasksFound = await dataSource
        .getRepository(taskSchema)
        .createQueryBuilder('tasks')
        .getMany()
      const success: boolean = !!tasksFound

      if (!success) throw new Error('[TasksTypeOrmAdapter.findAll] Unable to get the list of tasks')
      
      return {
        success,
        data: tasksFound
      }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async findById (id: String): Promise<TaskRepositoryResults> {
    try {
      const taskFound = await dataSource
        .getRepository(taskSchema)
        .createQueryBuilder('tasks')
        .where('id = :id', { id })
        .getOne()
      const success: boolean = !!(taskFound && taskFound.id)
      
      if (!success) throw new Error('[TasksTypeOrmAdapter.findById] Unable to get task')

      return {
        success,
        data: taskFound
      }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async findByDescription (description: string): Promise<TaskRepositoryResults> {
    try {
      const taskFound = await dataSource
        .getRepository(taskSchema)
        .createQueryBuilder('tasks')
        .where('description = :description', { description })
        .getOne()
      const success: boolean = !!(taskFound && taskFound.description === description)

      return {
        success,
        data: taskFound
      }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async updateById (taskData: TaskData): Promise<TaskRepositoryResults> {
    try {
      const { id, description, isDone } = taskData
      const queryResult: UpdateResult = await dataSource
        .createQueryBuilder()
        .update(taskSchema)
        .set({ description: description as string, isDone: isDone as boolean })
        .where('id = :id', { id })
        .execute()

      const success: boolean = !!queryResult.generatedMaps
      
      if (!success) throw new Error('[TasksTypeOrmAdapter.updateById] Unable to update task')
      
      return {
        success,
        data: queryResult.generatedMaps
      }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async deleteById (id: string): Promise<TaskRepositoryResults> {
    try {
      const deleteResult: DeleteResult = await dataSource
        .createQueryBuilder()
        .delete()
        .from(taskSchema)
        .where('id = :id', { id })
        .execute()

      const success: boolean = deleteResult.affected !== null
      
      return {
        success,
        data: deleteResult
      }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }
}

export default TasksTypeOrmAdapter