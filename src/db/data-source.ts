import { DataSource } from 'typeorm'
import dotenv from 'dotenv'

const env = process.env.NODE_ENV ?? 'development'
const dbDict = { development: 'postgres', test: 'sqlite' }
const envFileDict  = { development: '.env', test: '.env.test' }

dotenv.config({ path: envFileDict[env] ?? '.env' })

const dataSource = new DataSource({
  type: dbDict[env] ?? 'postgres',
  host: process.env.POSTGRES_HOST as string,
  port: Number(process.env.POSTGRES_PORT) as number,
  username: process.env.POSTGRES_USER as string,
  password: process.env.POSTGRES_PASSWORD as string,
  database: process.env.POSTGRES_DB as string,
  entities: ['src/**/*/*.schema.ts'],
  logging: true,
  synchronize: true
})

export default dataSource