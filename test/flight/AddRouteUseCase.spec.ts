import { FlightRepository } from "../../app/modules/flight/infra/repositories/FlightRepository"
import { AddRouteRequest } from "../../app/modules/flight/input/requests/AddRouteRequest"
import { AddRouteUseCase } from "../../app/modules/flight/usecases"
import { ErrorMessages } from "../../app/modules/core/utils/ErrorMessages"
import { stub } from "../utils/stub"


describe('Flight :: AddRouteUseCase', () => {
  let flightRepository: FlightRepository
  let request: AddRouteRequest
  let addRouteUseCase: AddRouteUseCase

  beforeEach(() => {
    flightRepository = stub<FlightRepository>()
    addRouteUseCase = new AddRouteUseCase(flightRepository)
  })

  describe('Invalid input', () => {
    it('returns statusCode 400 and an "invalid input" error message', () => {
      // @ts-ignore
      request = {}
      const response = addRouteUseCase.execute(request)

      expect(response).toHaveProperty('error')
      expect(response.error).toBe(ErrorMessages.flight.invalidInputAddRoute)
    })
  })
})
