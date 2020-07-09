import { FindBestRouteUseCase } from '../../app/modules/flight/usecases'
import { FlightRepository } from '../../app/modules/flight/infra/repositories/FlightRepository'
import { ErrorMessages } from '../../app/modules/core/utils/ErrorMessages'
import { Flight } from '../../app/modules/flight/infra/entities/Flight'
import { removeUndefined } from '../../app/modules/core/helpers/removeUndefined'
import { dataMock } from '../utils/dataMock'
import { stub } from '../utils/stub'
import { MinimumCostResponse } from '../../app/modules/core/helpers/findMinimunCostBetweenNodes'

describe('Flight :: FindBestRouteUseCase', () => {
  let flightRepository: FlightRepository
  let findBestRouteUseCase: FindBestRouteUseCase
  let itinerary: string
  let cli: boolean

  const listAirports = (flights: Flight[]): string[] => {
    let airports: string[] = []
    flights.map(flight => {
      airports.push(flight.departure)
      airports.push(flight.destination)
    })

    const airportsWithoutUndefined = removeUndefined<string[]>(airports)
    return [...new Set(airportsWithoutUndefined)]
  }

  const findFlightsDepartingFrom = (airport: string, flights: Flight[]) => {
    return flights.filter(flight => flight.departure === airport)
  }

  let flightsMock: Flight[]
  beforeAll(() => {
    itinerary = 'GRU-CDG'

    flightsMock = dataMock<Flight[]>([
      { departure: 'GRU', destination: 'BRC', cost: 10 },
      { departure: 'BRC', destination: 'SCL', cost: 5 },
      { departure: 'GRU', destination: 'CDG', cost: 75 },
      { departure: 'GRU', destination: 'SCL', cost: 20 },
      { departure: 'GRU', destination: 'ORL', cost: 56 },
      { departure: 'ORL', destination: 'CDG', cost: 5 },
      { departure: 'SCL', destination: 'ORL', cost: 20 }
    ])
  })

  beforeEach(() => {
    flightRepository = stub<FlightRepository>()
    flightRepository.listFlights = jest.fn().mockReturnValue(flightsMock)
    flightRepository.listAirports = jest.fn().mockReturnValue(listAirports(flightsMock))
    flightRepository.findFlightsDepartingFrom = jest.fn()
      .mockReturnValueOnce(findFlightsDepartingFrom('GRU', flightsMock))
      .mockReturnValueOnce(findFlightsDepartingFrom('BRC', flightsMock))
      .mockReturnValueOnce(findFlightsDepartingFrom('ORL', flightsMock))
      .mockReturnValueOnce(findFlightsDepartingFrom('SCL', flightsMock))
      .mockReturnValueOnce(findFlightsDepartingFrom('CDG', flightsMock))

    findBestRouteUseCase = new FindBestRouteUseCase(flightRepository)
  })

  describe('Success', () => {
    it('returns the best route as "GRU, BRC, SCL, ORL, CDG" at cost 40', () => {
      cli = true
      const response = findBestRouteUseCase.execute(itinerary, cli)

      const responseData = response.data as MinimumCostResponse
      expect(responseData).toBeDefined()
      expect(responseData.distance).toBe(40)
      expect(responseData.path.join(' - ')).toBe('GRU - BRC - SCL - ORL - CDG')
    })
  })

  describe('Informed itinerary is incorrect', () => {
    it('throws an exception for "wrong request pattern" when interface is CLI', () => {
      itinerary = 'TESTE' // I'd probably use Faker here. Just avoiding to use more libs
      cli = true

      const execute = () => findBestRouteUseCase.execute(itinerary, cli)
      expect(execute).toThrow(ErrorMessages.flight.wrongCliItineraryPattern)
    })

    it('returns a statusCode 400 and a "wrong request pattern" error when interface is the API', () => {
      itinerary = 'TESTE'
      cli = false

      const response = findBestRouteUseCase.execute(itinerary, cli)

      expect(response.statusCode).toBe(400)
      expect(response.error).toBe(ErrorMessages.flight.wrongRestItineraryPattern)
    })
  })

  describe('Best route cannot be found', () => {
    it('throws an exception for "unable to locate best route" when interface is CLI', () => {
      cli = true
      const execute = () => findBestRouteUseCase.execute('GRU-UDI', cli)

      expect(execute).toThrow(ErrorMessages.flight.routeNotFound)
    })

    it('returns a statusCode 404 and a "unable to locate best route" error when interface is the API', () => {
      cli = false
      const response = findBestRouteUseCase.execute('GRU-UDI', cli)

      expect(response.statusCode).toBe(404)
      expect(response.error).toBe(ErrorMessages.flight.routeNotFound)
    })
  })
})
