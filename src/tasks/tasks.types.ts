export type TaskData = {
  id?: string | undefined | unknown
  description: string | unknown
  isDone: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ITaskUseCases {
  readonly taskRepository: ITasksRepository
  addTask: (data: TaskData) => Promise<TaskRepositoryResults>
  listTasks: () => Promise<TaskRepositoryResults>
  getTask: (id: string) => Promise<TaskRepositoryResults>
  updateTask: (taskData: TaskData) => Promise<TaskRepositoryResults>
}

export type TaskRepositoryResults = {
  success: boolean,
  data: Object | Object[] | TaskData | null
  error?: unknown | null 
}

export interface ITasksRepository {
  create: (data: TaskData) => Promise<TaskRepositoryResults>
  findAll: () => Promise<TaskRepositoryResults>
  findById: (id: string) => Promise<TaskRepositoryResults>
  findByDescription: (email: string) => Promise<TaskRepositoryResults>
  updateById: (data: TaskData) => Promise<TaskRepositoryResults>
  deleteById: (id: string) => Promise<TaskRepositoryResults>
}

export interface ITasksController {
  getAll: Function
  getOne: Function
  add: Function
  updateOne: Function
  deleteOne: Function
  login: Function
}
