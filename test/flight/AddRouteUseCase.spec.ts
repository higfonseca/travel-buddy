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

  describe('Success', () => {
    it('calls save method on FlightRepository with the correct parameter', () => {
      const from = 'GRU'
      const to = 'UDI'
      const cost = 13

      request = { from, to, cost }

      flightRepository.save = jest.fn()
      addRouteUseCase.execute(request)

      const routeString = `${from},${to},${cost}`
      expect(flightRepository.save).toHaveBeenCalledWith(routeString)
    })
  })

  describe('Invalid input', () => {
    it('returns statusCode 400 and an "invalid input" error message', () => {
      // @ts-ignore
      request = {}
      const response = addRouteUseCase.execute(request)

      expect(response.statusCode).toBe(400)
      expect(response.error).toBe(ErrorMessages.flight.invalidInputAddRoute)
    })
  })
})
