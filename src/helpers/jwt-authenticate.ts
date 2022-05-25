import { expressjwt } from 'express-jwt'

const jwtAuthenticate = expressjwt({
  secret: process.env.JWT_SECRET as string,
  algorithms: ["HS256"]
})

export { jwtAuthenticate }