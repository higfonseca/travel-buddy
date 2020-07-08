// import { FlightRepository } from "../infra/repositories/FlightRepository"
import { AddRouteRequest } from "app/modules/flight/input/requests/AddRouteRequest"
import { AddRouteResponse } from "../input/responses/AddRouteResponse"
import { ErrorMessages } from "../../core/utils/ErrorMessages"
import { logger } from "../../core/helpers/logger"
import { FlightRepository } from "../infra/repositories/FlightRepository"

export class AddRouteUseCase {
  constructor (
    private readonly flightRepository: FlightRepository
  ) {}

  execute (request: AddRouteRequest): AddRouteResponse {
    const { from, to, cost } = request
    if (!from || !to || !cost) {
      const error = ErrorMessages.flight.invalidInputAddRoute
      logger(error)

      return {
        statusCode: 400,
        error
      }
    }

    const routeString = `${from},${to},${cost}`
    this.flightRepository.save(routeString)

    return { data: { route: request } }
  }
}
