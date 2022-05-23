import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import helmet from 'helmet'

import { userRouter } from '../users'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(helmet())

const apiVersion1 = '/api/v1'
app.use(apiVersion1, userRouter)

app.use((_, res) => {
  res.status(404).json({ message: 'This route does not exist.' })
})

app.get('/healthy', (_, res) => {
  res.json('HEALTHY')
})

export default app
