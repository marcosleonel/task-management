class Subscriptions {
  readonly eventType: string

  constructor (eventType: string) {
    this.eventType = eventType
  }

  isPaymentEvent(): boolean {
    const enventTypes = [
      'payment_intent.succeeded',
      'checkout.session.completed',
      'invoice.paid',
      'invoice.payment_failed'
    ]

    return enventTypes.includes(this.eventType)
  }

  paymentStatus(): string {
    if (!this.isPaymentEvent) throw new Error('[SubscriptionEntity.paymentStatus] Not a payment status');

    const enventTypes = {
      'payment_intent.succeeded': 'paid',
      'checkout.session.completed': 'paid',
      'invoice.paid': 'paid',
      'invoice.payment_failed': 'failed'
    }

    return enventTypes[this.eventType]
  }

  isSubscriptionEvent(): boolean {
    const enventTypes = [
      'customer.subscription.created',
      'checkout.session.completed',
      'invoice.paid',
      'invoice.payment_failed'
    ]

    return enventTypes.includes(this.eventType)
  }

  subscriptionStatus(): string {
    if (!this.isSubscriptionEvent) throw new Error('[SubscriptionEntity.paymentStatus] Not a payment status');

    const enventTypes = {
      'customer.subscription.created': 'created',
      'customer.subscription.updated': 'updated',
      'customer.subscription.deleted': 'deleted'
    }

    return enventTypes[this.eventType]
  }
}

export default Subscriptions