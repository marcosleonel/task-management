import Subscriptions from './subscriptions.entity'
import StripeAdapter from './subscriptions.stripeAdapter'
import { ISubscriptionsUseCases, OperationResult, PaymentStatus, StripeEvent, SubscriptionStatus } from './subscriptions.types'
import { UserData, UsersTypeOrmRepository } from '../users' 

class SubscriptionsUseCases implements ISubscriptionsUseCases {
  readonly subscriptionAdapter: StripeAdapter
  readonly userRepository: UsersTypeOrmRepository

  constructor(subscriptionAdapter: StripeAdapter, userRepository: UsersTypeOrmRepository) {
    this.subscriptionAdapter = subscriptionAdapter
    this.userRepository = userRepository
  }

  /**
   * Creates a checkout session in order to the user complete the subscription process.
   * @returns Promise<OperationResult>
   * @see https://stripe.com/docs/billing/subscriptions/build-subscriptions?ui=checkout#create-session
   */
  async createCheckoutSession(): Promise<OperationResult> {
    try {
      const { success, data } = await this.subscriptionAdapter.createSession()

      if (!success) throw new Error('[SubscriptionsUseCases.createCheckoutSession] Unable to create session')

      return { success, data }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  /**
   * Handles the subscription events in order to activate or deactivate the premium account
   * @param body Object
   * @param sig any
   * @returns Promise<OperationResult>
   * @see https://stripe.com/docs/billing/subscriptions/build-subscriptions?ui=checkout#provision-and-monitor
   */
  async monitorSubscription(body: Object, sig: any): Promise<OperationResult> {
    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string
      const { success, data } = this.subscriptionAdapter.constructEvent(body, sig, endpointSecret)

      if (!success) throw new Error('[SubscriptionsUseCases.monitorSubscription] Unable to create construct Event')

      const event = data as StripeEvent
      const subscriptions = new Subscriptions(event.type)
      const customer = event.data.object.customer as string

      if (subscriptions.isPaymentEvent()) {
        await this.takePaymentAction(subscriptions.paymentStatus(), customer)
      }

      if (subscriptions.isSubscriptionEvent()) {
        await this.takeSubscriptionAction(subscriptions.subscriptionStatus(), customer)
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

  /**
   * Update the `is_subscribed` field based on the status info of a payment event
   * @param paymentStatus String
   * @param customer String
   */
  async takePaymentAction (paymentStatus: string, customer: string): Promise<void> {
    const userQuery = await this.userRepository.findBySubscriptionId(customer)

    if (!userQuery.success) {
      throw new Error('[SubscriptionsUseCases.takePaymentAction] Unable subscription ID')
    }

    const isSubscribed = paymentStatus === PaymentStatus.PAID
    const user = userQuery.data as UserData
  
    user.isSubscribed = isSubscribed
    
    const { success } = await this.userRepository.updateById(user)

    if (!success) {
      throw new Error('[SubscriptionsUseCases.takePaymentAction] Unable to update user subscription status')
    }
  }

  async takeSubscriptionAction (subscriptionStatus: string, customer: string) {
    const userQuery = await this.userRepository.findBySubscriptionId(customer)

    if (!userQuery.success) {
      throw new Error('[SubscriptionsUseCases.takePaymentAction] Unable subscription ID')
    }

    const isSubscribed = subscriptionStatus !== SubscriptionStatus.DELETED
    const user = userQuery.data as UserData
  
    user.isSubscribed = isSubscribed
    
    const { success } = await this.userRepository.updateById(user)

    if (!success) {
      throw new Error('[SubscriptionsUseCases.takePaymentAction] Unable to update user subscription status')
    }
  }
}

export default SubscriptionsUseCases
