import type { TaskData, TaskRepositoryResults } from './'
import {
  Tasks,
  ITasksRepository,
  ITaskUseCases
} from './'

class TasksUseCases implements ITaskUseCases {
  readonly taskRepository: ITasksRepository

  constructor(repository: ITasksRepository) {
    this.taskRepository = repository
  }

  async addTask (taskData: TaskData): Promise<TaskRepositoryResults> {
    const newTask = new Tasks(taskData.description as string, taskData.isDone as boolean)
    const validation = newTask.validate()

    if (validation.error) return validation

    try {
      const { data, success } = await this.taskRepository.create(taskData)

      if (!success) throw new Error('[TasksUseCases.addTask] Unable to add task.')

      return { success, data }
    } catch (error: unknown) {
      return {
        success: false,
        error,
        data: null
      }
    }
  }

  async listTasks (): Promise<TaskRepositoryResults> {
    try {
      const { data, success } = await this.taskRepository.findAll()

      if (!success) {
        throw new Error(`
          [TasksUseCases.listTasks] Unable to get the list of tasks.
          Data: \n ${data}\n Succes: \n ${success}
        `)
      }

      return { success, data }
    } catch(error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }
  
  async getTask (id: string): Promise<TaskRepositoryResults> {
    try {
      const { data, success } = await this.taskRepository.findById(id)

      if (!success) throw new Error('[TasksUseCases.getTask] Unable to get task')

      return { success, data }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async getTaskByDescription (description: string): Promise<TaskRepositoryResults> {
    try {
      const { data, success } = await this.taskRepository.findByDescription(description)

      if (!success) throw new Error('[TasksUseCases.getTaskByDescription] Unable to get task')

      return { success, data }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async updateTask (taskData: TaskData): Promise<TaskRepositoryResults> {
    try {
      const { data, success } = await this.taskRepository.updateById(taskData)
      
      if (!success) throw new Error('[TasksUseCases.updateTask] Unable to get the list of tasks')

      return { success, data }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async deleteTask (id: string): Promise<TaskRepositoryResults> {
    try {
      const { data, success } = await this.taskRepository.deleteById(id)

      if (!success) throw new Error('[TasksUseCases.updateTask] Unable to delete task')

      return { success, data }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }
}

export default TasksUseCases
