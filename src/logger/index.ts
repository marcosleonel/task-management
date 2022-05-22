import { Format } from 'logform'
import path from 'path'
import { createLogger, format, transports } from 'winston'

const {
  combine,
  timestamp,
  label,
  printf
} = format

const logFormat: Format = printf((info): string => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
})

const logger = createLogger({
  format: combine(
    format.colorize(),
    format.json(),
    label({ label: 'API' }),
    timestamp(),
    logFormat
  ),

  transports: [
    new (transports.Console)(),
    new transports.File({
      filename: path.join(__dirname, '/logs/debug.log')
    })
  ],

  exceptionHandlers: [
    new (transports.Console)(),
    new transports.File({
      filename: path.join(__dirname, '/logs/exceptions.log')
    })
  ],

  exitOnError: false
})

export default logger
