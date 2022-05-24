export type OperationResult = {
  success: boolean,
  data: Object | Object[] | null
  error?: unknown | null
}

export interface ISubscriptionsUseCases {
  createSubscriptionSession: () => Promise<OperationResult>
  monitorSubscription: (body: Object, sig: any) => Promise<OperationResult>
}

export interface ISusbscriptionsController {
  createSession: Function
  handleEvent: Function
}