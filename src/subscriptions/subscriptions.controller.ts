import { Response } from 'express'
import { Request } from 'express-jwt'
import logger from '../logger'

import StripeAdapter from './subscriptions.stripeAdapter'
import { ISusbscriptionsController, StripeSession } from './subscriptions.types'
import SubscriptionsUseCases from './subscriptions.useCases'
import { UsersTypeOrmRepository } from '../users'

class SusbscriptionsController implements ISusbscriptionsController {
  readonly useCases: SubscriptionsUseCases

  constructor() {
    this.useCases = new SubscriptionsUseCases(new StripeAdapter(), new UsersTypeOrmRepository())
  }

  async createSession (_, res: Response) {
    try {
      const { success, data } = await this.useCases.createCheckoutSession()

      if (!success) throw new Error('[SusbscriptionsController.createSession] Unable to create session')

      const session = data as StripeSession

      return res.redirect(303, session.url)
    } catch (error: unknown) {
      logger.error(`[SusbscriptionsController.createSession]: ${error}`)
      return res.status(500).json({ message: 'An internal error occured' })
    }
  }

  async handleEvent (req: Request, res: Response) {
    try {
      const sig = req.headers['stripe-signature']
      const { success } = await this.useCases.monitorSubscription(req.body, sig)

      if (!success) throw new Error('[SusbscriptionsController.handleEvent] Unable to create session')

      return res.sendStatus(200)
    } catch (error: unknown) {
      logger.error(`[SusbscriptionsController.createSession]: ${error}`)
      return res.status(500).json({ message: 'An internal error occured' })
    }
  }
}

export default SusbscriptionsController
