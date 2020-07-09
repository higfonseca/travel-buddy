/**
 * I could just import AddRouteRequest here, but considering that
 * on a conventional application we would be dealing with databases,
 * we'd probably add more props on the response body that doesn't
 * come on the request (off course avoiding overfetching).
 */
export interface AddRouteResponse {
  statusCode?: number
  error?: string
  data?: {
    route: {
      from: string
      to: string
      cost: number
    }
  }
}
