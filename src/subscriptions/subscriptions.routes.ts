import { raw, Router } from 'express'

import { jwtAuthenticate } from '../helpers/jwt-authenticate'
import SubscriptionController from './subscriptions.controller'

const subscriptionRouter = Router()
const subscriptionController = new SubscriptionController()

subscriptionRouter.get('/subscriptions/create-session', jwtAuthenticate, subscriptionController.createSession)
subscriptionRouter.get('/subscriptions/finish-session', jwtAuthenticate, subscriptionController.finishSession)
subscriptionRouter.post(
  '/subscriptions/webhook',
  raw({type: 'application/json'}),
  subscriptionController.handleEvent
)

export default subscriptionRouter
