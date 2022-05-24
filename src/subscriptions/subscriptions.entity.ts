import { PaymentStatus, SubscriptionStatus } from "./subscriptions.types";

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
      'payment_intent.succeeded': PaymentStatus.PAID,
      'checkout.session.completed': PaymentStatus.PAID,
      'invoice.paid': PaymentStatus.PAID,
      'invoice.payment_failed': PaymentStatus.FAILED
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
      'customer.subscription.created': SubscriptionStatus.CREATED,
      'customer.subscription.updated': SubscriptionStatus.UPDATED,
      'customer.subscription.deleted': SubscriptionStatus.DELETED
    }

    return enventTypes[this.eventType]
  }
}

export default Subscriptions