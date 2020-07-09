import { MinimumCostResponse } from '../../../core/helpers/findMinimunCostBetweenNodes';

export interface FindBestRouteResponse {
  statusCode?: number
  error?: string
  data?: MinimumCostResponse
}
