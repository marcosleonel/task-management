import Subscriptions from './subscriptions.entity'
import StripeAdapter from './subscriptions.stripeAdapter'
import { ISubscriptionsUseCases, OperationResult } from './subscriptions.types'
import { UsersTypeOrmRepository } from '../users' 

class SubscriptionsUseCases implements ISubscriptionsUseCases {
  readonly subscriptionAdapter: StripeAdapter
  readonly userRepository: UsersTypeOrmRepository

  constructor(subscriptionAdapter: StripeAdapter, userRepository: UsersTypeOrmRepository) {
    this.subscriptionAdapter = subscriptionAdapter
    this.userRepository = userRepository
  }

  async createSubscriptionSession(): Promise<OperationResult> {
    try {
      const { success, data } = await this.subscriptionAdapter.createSession()

      if (!success) throw new Error('[SubscriptionsUseCases.createSubscriptionSession] Unable to create session')

      return { success, data }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async monitorSubscription(body: Object, sig: any): Promise<OperationResult> {
    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string
      const { success, data } = this.subscriptionAdapter.constructEvent(body, sig, endpointSecret)

      if (!success) throw new Error('[SubscriptionsUseCases.monitorSubscription] Unable to create construct Event')

      const subscriptions = new Subscriptions(data.type as string)

      if (subscriptions.isPaymentEvent()) {
        this.takePaymentAction(subscriptions.paymentStatus())
      }

      if (subscriptions.isSubscriptionEvent()) {
        this.takeSubscriptionAction(subscriptions.subscriptionStatus())
      }

      return { success, data }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  async takePaymentAction (paymentStatus) {
    // TODO: change the `User.isSubscribed` value based on the payment status
  }

  async takeSubscriptionAction (subscriptionStatus) {
    // TODO: change the `User.isSubscribed` value based on the subscription status
  }
}

export default SubscriptionsUseCases
