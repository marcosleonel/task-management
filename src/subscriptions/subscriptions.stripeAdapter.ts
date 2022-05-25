import { OperationResult } from  './subscriptions.types'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

class StripeAdapter {
  readonly priceId : string

  constructor() {
    this.priceId = process.env.SUBSCRIPTION_PRICE_ID as string
  }

  async createSession (userId: string, userEmail: string, appUrl: string) {
    const sessionOptions: Object = {
      mode: 'subscription',
      line_items: [
        {
          price: this.priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout-cancel`,
      client_reference_id: userId,
      customer_email: userEmail
    }

    let session: Object

    try {
      session = await stripe.checkout.sessions.create(sessionOptions)

      return {
        success: true,
        data: session
      }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  constructEvent(body: object, sig: any, endpointSecret: string): OperationResult {
    try {
      const data = stripe.webhooks.constructEvent(body, sig, endpointSecret);

      return {
        success: true,
        data
      }
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }
}

export default StripeAdapter