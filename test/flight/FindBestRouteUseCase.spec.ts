import { FindBestRouteUseCase } from "../../app/modules/flight/usecases"
import { FlightRepository } from "../../app/modules/flight/infra/repositories/FlightRepository"
import { ErrorMessages } from "../../app/modules/core/utils/ErrorMessages"
import { Flight } from "../../app/modules/flight/infra/entities/Flight"
import { dataMock } from "test/utils/dataMock"
import { removeUndefined } from "../../app/modules/core/helpers/removeUndefined"

/**
 * About the repository: probably, if I was using a DB, I'd stub every
 * repository call (as I did on the AddRoute test).
 * But, as I'm using a CSV as data source and the methods that this
 * UseCase calls are all just "maps/finds" on the CSV data, there is no
 * point on duplicating them here. That's why I'm instantiating the
 * repository itself.
 */

describe('Flight :: FindBestRouteUseCase', () => {
  let flightRepository: FlightRepository
  let findBestRouteUseCase: FindBestRouteUseCase
  let itinerary: string
  let cli: boolean

  let flights: Flight[]
  beforeAll(() => {
    flights = dataMock<Flight[]>([
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
    flightRepository = new FlightRepository()
    flightRepository.listFlights = jest.fn().mockReturnValue(flights)

    findBestRouteUseCase = new FindBestRouteUseCase(flightRepository)
  })

  describe('Success', () => {
    it('returns the best route option with its cost', () => {
      function listAirports (): string[] {
        let airports: string[] = []
        flights.map(flight => {
          airports.push(flight.departure)
          airports.push(flight.destination)
        })

        const airportsWithoutUndefined = removeUndefined<string[]>(airports)
        return [...new Set(airportsWithoutUndefined)]
      }

      function findFlightsDepartingFrom (airport: string): Flight[] {
        return flights.filter(flight => flight.departure === airport)
      }

      flightRepository.listAirports = jest.fn().mockReturnValue(listAirports)
      flightRepository.findFlightsDepartingFrom = jest.fn().mockReturnValue(findFlightsDepartingFrom)
    })
  })

  describe('Informed itinerary is incorrect', () => {
    it('throws an exception when interface is CLI', () => {
      itinerary = 'TESTE' // I'd probably use Faker here. Just avoiding to use more libs
      cli = true

      const execute = () => findBestRouteUseCase.execute(itinerary, cli)
      expect(execute).toThrow(ErrorMessages.flight.wrongCliItineraryPattern)
    })

    it('returns a statusCode 400 and a "wrong rest integration pattern" error', () => {
      itinerary = 'TESTE'
      cli = false

      const response = findBestRouteUseCase.execute(itinerary, cli)

      expect(response.statusCode).toBe(400)
      expect(response.error).toBe(ErrorMessages.flight.wrongRestItineraryPattern)
    })
  })

  // describe('Best route cannot be found', () => {
  //   it('throws an exception when interface is CLI', () => {})
  //   it('returns a statusCode 404 and a "unable to locate best route" error', () => {})
  // })
})
