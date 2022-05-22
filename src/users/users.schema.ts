import { EntitySchema } from 'typeorm'

export const userSchema = new EntitySchema({
  name: 'users',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
      unique: true
    },
    email: { 
      type: 'varchar',
      nullable: false,
      unique: true,
      length: 255
    },
    password: {
      type: 'varchar',
      nullable: false,
      length: 255
    }
  }
})
