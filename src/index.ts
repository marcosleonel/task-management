import app from './app'
import { dataSource } from './db'
import logger from './logger'

dataSource
  .initialize()
  .then(() => logger.info('Database has been initialized!'))
  .catch(error => logger.error('Error during database initialization: ', error))

const port = Number(process.env.PORT ?? 8080)
const host = process.env.HOST ?? 'localhost'
const server = app.listen(Number(process.env.PORT ?? 8080), '0.0.0.0', () => {
  logger.info(`Task Management Started At: http://${host}:${port}`)
})

function handleUnhandledRejectionError (unhandledRejectionError: Error): void {
  logger.error(unhandledRejectionError.stack)
  process.exit(1)
}

function handleSigterm (): void {
  logger.info('SIGTERM signal received.')
  logger.info('Closing HTTP server...')

  server.close(async (): Promise<Promise<void>> => {
    logger.info('Closing the database connection...')

    try {
      await dataSource.destroy()
      logger.info('Database connection closed.')
    } catch (error) {
      logger.error('Error during database connection closing.')
    }

    logger.info('Closing HTTP server...')
    process.exit(0)
  })
}

process.on('unhandledRejection', handleUnhandledRejectionError)
process.on('SIGTERM', handleSigterm)
