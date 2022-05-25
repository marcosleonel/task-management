import { EntitySchema, EntitySchemaOptions } from 'typeorm'

import { TaskData } from './tasks.types'

export const taskSchema = new EntitySchema({
  name: 'tasks',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
      unique: true
    },
    description: { 
      type: 'varchar',
      nullable: false,
      unique: true,
      length: 255
    },
    isDone: {
      name: 'is_done',
      type: 'boolean',
      nullable: false,
      default: false
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp with time zone',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp with time zone',
      updateDate: true,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'users',
      joinColumn: {
        name: 'user_id'
      },
      inverseSide: 'tasks'
    }
  }
} as EntitySchemaOptions<TaskData>)
