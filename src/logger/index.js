import path from 'path'
import { createLogger, format, transports } from 'winston'

const {
  combine,
  timestamp,
  label,
  printf
} = format

const logFormat = printf((info) => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`)

const logger = createLogger({
  format: combine(
    format.colorize(),
    format.json(),
    label({ label: 'API' }),
    timestamp(),
    logFormat
  ),

  transports: [
    new (transports.Console)({
      json: false,
      timestamp: true
    }),
    new transports.File({
      filename: path.join(__dirname, '/logs/debug.log'),
      json: false
    })
  ],

  exceptionHandlers: [
    new (transports.Console)({
      json: false,
      timestamp: true
    }),
    new transports.File({
      filename: path.join(__dirname, '/logs/exceptions.log'),
      json: false
    })
  ],

  exitOnError: false
})

export default logger
