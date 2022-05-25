import Subscriptions from './subscriptions.entity'
import StripeAdapter from './subscriptions.stripeAdapter'
import {
  ISubscriptionsUseCases,
  OperationResult,
  PaymentStatus,
  StripeEvent,
  SubscriptionStatus,
  StripeSession
} from './subscriptions.types'
import { UserData, UsersTypeOrmAdapter } from '../users' 

class SubscriptionsUseCases implements ISubscriptionsUseCases {
  readonly subscriptionAdapter: StripeAdapter
  readonly userRepository: UsersTypeOrmAdapter

  constructor(subscriptionAdapter: StripeAdapter, userRepository: UsersTypeOrmAdapter) {
    this.subscriptionAdapter = subscriptionAdapter
    this.userRepository = userRepository
  }

  /**
   * Creates a checkout session in order to the user complete the subscription process.
   * @returns Promise<OperationResult>
   * @see https://stripe.com/docs/billing/subscriptions/build-subscriptions?ui=checkout#create-session
   */
  async createCheckoutSession(userId: string, userEmail: string, appUrl: string): Promise<OperationResult> {
    try {
      const session = await this.subscriptionAdapter.createSession(userId, userEmail, appUrl)
      const sessionData = session.data as StripeSession
      const userQuery = await this.userRepository.findBySubscriptionId(sessionData.id)
      const isSubscribed = sessionData.payment_status === PaymentStatus.ACTIVE
      const user = userQuery.data as UserData
    
      user.isSubscribed = isSubscribed 
      user.subscriptionId = sessionData.id
      
      const { success, data, error } = await this.userRepository.updateById(user)

      if (!success) {
        throw new Error(`[SubscriptionsUseCases.createCheckoutSession] Unable to create session: ${error}`)
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
   * Takes the information about a checkout session completed. 
   * @param sessionId String id returned by Stripe in the session object
   * @returns Promise<OperationResult>
   * @see https://stripe.com/docs/api/checkout/sessions/retrieve?lang=node
   */
  async finishCheckoutSession(sessionId: string): Promise<OperationResult> {
    try {
      const session = await this.subscriptionAdapter.retrieveSession(sessionId)
      const sessionData = session.data as StripeSession
      const userQuery = await this.userRepository.findBySubscriptionId(sessionId)
      const isSubscribed = sessionData.payment_status === PaymentStatus.ACTIVE
      const user = userQuery.data as UserData
    
      user.isSubscribed = isSubscribed
      
      const { success, data, error } = await this.userRepository.updateById(user)

      if (!success) {
        throw new Error(`[SubscriptionsUseCases.finishCheckoutSession] Unable to create session: ${error}`)
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
   * Handles the subscription events in order to activate or deactivate the premium account
   * @param body Object
   * @param sig any
   * @returns Promise<OperationResult>
   * @see https://stripe.com/docs/billing/subscriptions/build-subscriptions?ui=checkout#provision-and-monitor
   */
  async monitorSubscription(body: Object, sig: any): Promise<OperationResult> {
    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string
      const { success, data } = await this.subscriptionAdapter.constructEvent(body, sig, endpointSecret)

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

    const isSubscribed = paymentStatus === PaymentStatus.ACTIVE
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
