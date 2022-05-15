import express from 'express'
import morgan from 'morgan'

const app = express()
const port = Number(process.env.PORT ?? 8080)
const host = process.env.HOST ?? 'localhost'

app.use(morgan('dev'))
app.get('/healthy', (_, res) => {
  res.json('HEALTHY')
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Task Management started at: http://${host}:${port}`)
})
