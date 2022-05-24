export type OperationResult = {
  success: boolean,
  data: Object | Object[] | null
  error?: unknown | null
}

export interface ISubscriptionsUseCases {
  createCheckoutSession: () => Promise<OperationResult>
  monitorSubscription: (body: Object, sig: any) => Promise<OperationResult>
  takePaymentAction: (paymentStatus: string, customer: string) => Promise<void>
  takeSubscriptionAction: (subscriptionStatus: string, customer: string) => Promise<void>
}

export interface ISusbscriptionsController {
  createSession: Function
  handleEvent: Function
}

export enum PaymentStatus {
  PAID = 'paid',
  FAILED = 'failed'
}

export enum SubscriptionStatus {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted'
}

export type StripeWebhookBody = {
  event: StripeEvent
}

export type StripeEvenRequest = {
  id: string | number | null
  idempotency_key: string | number | null
}

export type StripeAcssDebitMandateOptions = {
  interval_description: string
  payment_schedule: string
  transaction_type: string
}

export type StripeAcssDebit = {
  currency: string
  mandate_options: StripeAcssDebitMandateOptions
  verification_method: string
}

export type StripePaymentMethodOption = {
  acss_debit: StripeAcssDebit
}

export type StripeEventDataObject = {
  id: string
  object: string
  application: string | null
  cancellation_reason: string | null
  client_secret: string
  created: number
  customer: string | null
  description: string | null
  last_setup_error: unknown | null
  latest_attempt: unknown | null
  livemode: boolean
  mandate: string | null
  metadata: Object
  next_action: string | null
  on_behalf_of: string | null
  payment_method: string
  payment_method_options: StripePaymentMethodOption
  payment_method_types: string[]
  single_use_mandate: unknown | null
  status: string
  usage:string
}

export type StripeEventData = {
  object: StripeEventDataObject
}

export type StripeEvent = {
  id: string
  object: string
  api_version: string
  created: number
  type: string
  livemode: boolean
  pending_webhooks: number
  request: StripeEvenRequest
  data: StripeEventData
}

export type StripeSessionAutomaticTax = {
  enabled: boolean
  status: any | null
}

export type StripeSessionPhoneNumberCollection = {
  enabled: boolean
}

export type StripeSession = {
  id: string
  object: string
  after_expiration: unknown | null
  allow_promotion_codes: unknown | null
  amount_subtotal: unknown | null
  amount_total: unknown | null
  automatic_tax: StripeSessionAutomaticTax
  billing_address_collection: unknown | null
  cancel_url: string
  client_reference_id: unknown | null
  consent: unknown | null
  consent_collection: unknown | null
  currency: unknown | null
  customer: string | null
  customer_creation: unknown | null
  customer_details: unknown | null
  customer_email: string | null
  expires_at: number
  livemode: boolean
  locale: unknown | null
  metadata: Object
  mode: string
  payment_intent: string
  payment_link: string | null
  payment_method_options: Object
  payment_method_types: string[]
  payment_status: string
  phone_number_collection: StripeSessionPhoneNumberCollection
  recovered_from: unknown | null
  setup_intent: unknown | null
  shipping: unknown | null
  shipping_address_collection: unknown | null
  shipping_options: unknown[]
  shipping_rate: unknown | null
  status: string
  submit_type: unknown | null
  subscription: unknown | null
  success_url: string
  total_details: null
  url: string
}
