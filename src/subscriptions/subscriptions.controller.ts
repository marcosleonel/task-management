import { Response } from 'express'
import { Request } from 'express-jwt'
import logger from '../logger'

import StripeAdapter from './subscriptions.stripeAdapter'
import { ISusbscriptionsController, StripeSession } from './subscriptions.types'
import SubscriptionsUseCases from './subscriptions.useCases'
import { UsersTypeOrmAdapter } from '../users'

class SusbscriptionsController implements ISusbscriptionsController {
  readonly useCases: SubscriptionsUseCases

  constructor() {
    this.useCases = new SubscriptionsUseCases(new StripeAdapter(), new UsersTypeOrmAdapter())
  }

  async createSession (req: Request, res: Response) {
    try {
      const useCases = new SubscriptionsUseCases(new StripeAdapter(), new UsersTypeOrmAdapter())
      const id = req.auth?.id as string
      const email = req.auth?.email as string
      const appUrl = `${req.protocol}://${req.hostname}`
      const { success, data, error } = await useCases.createCheckoutSession(id, email, appUrl)

      if (!success) {
        throw new Error(`[SusbscriptionsController.createSession] Unable to create session ${error}`)
      }

      const session = data as StripeSession

      return res.redirect(303, session.url)
    } catch (error: unknown) {
      logger.error(`[SusbscriptionsController.createSession]: ${error}`)
      return res.status(500).json({ message: 'An internal error occured' })
    }
  }

  async finishSession (req: Request, res: Response) {
    try {
      const { sessionId } = req.body
      const useCases = new SubscriptionsUseCases(new StripeAdapter(), new UsersTypeOrmAdapter())
      const { success, error } = await useCases.finishCheckoutSession(sessionId)

      if (!success) {
        throw new Error(`[SusbscriptionsController.finishSession] Unable to finish session ${error}`)
      }

      return res.sendStatus(200)
    } catch (error: unknown) {
      logger.error(`[SusbscriptionsController.finishSession]: ${error}`)
      return res.status(500).json({ message: 'An internal error occured' })
    }
  }

  async handleEvent (req: Request, res: Response) {
    try {
      const sig = req.headers['stripe-signature']
      const useCases = new SubscriptionsUseCases(new StripeAdapter(), new UsersTypeOrmAdapter())
      const { success } = await useCases.monitorSubscription(req.body, sig)

      if (!success) throw new Error('[SusbscriptionsController.handleEvent] Unable to create session')

      return res.sendStatus(200)
    } catch (error: unknown) {
      logger.error(`[SusbscriptionsController.handleEvent]: ${error}`)
      return res.status(500).json({ message: 'An internal error occured' })
    }
  }
}

export default SusbscriptionsController
