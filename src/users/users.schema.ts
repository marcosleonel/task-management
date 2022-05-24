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
    },
    isSubscribed: {
      name: 'is_subscribed',
      type: 'boolean',
      nullable: false,
      default: false
    },
    subscriptionId: {
      name: 'subscription_id',
      type: 'varchar',
      nullable: true,
      unique: true,
      length: 255
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
    }
  }
})
