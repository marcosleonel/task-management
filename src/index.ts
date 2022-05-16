import express from 'express'
import morgan from 'morgan'

import { dataSource } from './db'

dataSource
  .initialize()
  .then(() => console.log('Data Source has been initialized!'))
  .catch(error => console.error('Error during Data Source initialization: ', error))

const app = express()
const port = Number(process.env.PORT ?? 8080)
const host = process.env.HOST ?? 'localhost'

app.use(morgan('dev'))
app.get('/healthy', (_, res) => {
  res.json('HEALTHY')
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Task Management Started At: http://${host}:${port}`)
})
