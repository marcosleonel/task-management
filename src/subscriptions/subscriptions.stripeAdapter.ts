import { OperationResult } from "./subscriptions.types"

const stripe = require('stripe')('sk_test_Ho24N7La5CVDtbmpjc377lJI') // This is a public sumple secret test mode API Key.

class StripeAdapter {
  readonly priceId : string

  constructor() {
    this.priceId = process.env.SUBSCRIPTION_PRICE_ID as string
  }

  async createSession () {
    const sessionOptions: Object = {
      mode: 'subscription',
      line_items: [
        {
          price: this.priceId,
          quantity: 1,
        },
      ],
      success_url: 'https://x-team.com/?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://x-team.com/',

    }

    let session: Object

    try {
      session = await stripe.checkout.sessions.create(sessionOptions)

      return {
        sucesss: true,
        data: session
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error
      }
    }
  }

  constructEvent(body: object, sig: any, endpointSecret: string): OperationResult {
    // TODO: use the strip package to contruct event
    return {
      success: true,
      data: { body, sig, endpointSecret }
    }
  }
}

export default StripeAdapter