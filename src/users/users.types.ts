export type UserData = {
  id?: string | undefined | unknown
  email: string | unknown
  password: string | unknown
}

export interface IUserUseCases {
  readonly userRepository: IUsersRepository
  addUser: (data: UserData) => Promise<UserRepositoryResults>
  listUsers: () => Promise<UserRepositoryResults>
  getUser: (id: string) => Promise<UserRepositoryResults>
  getUserByEmail: (email: string) => Promise<UserRepositoryResults>
  updateUser: (userData: UserData) => Promise<UserRepositoryResults>
}

export type UserRepositoryResults = {
  success: boolean,
  data: Object | Object[] | UserData | null
  error?: unknown | null 
}

export interface IUsersRepository {
  create: (data: UserData) => Promise<UserRepositoryResults>
  findAll: () => Promise<UserRepositoryResults>
  findById: (id: string) => Promise<UserRepositoryResults>
  findByEmail: (email: string) => Promise<UserRepositoryResults>
  updateById: (data: UserData) => Promise<UserRepositoryResults>
  deleteById: (id: string) => Promise<UserRepositoryResults>
}

export interface IUserController {
  getAll: Function
  getOne: Function
  add: Function
  updateOne: Function
  deleteOne: Function
  login: Function
}
