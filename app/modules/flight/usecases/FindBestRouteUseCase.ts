import { FlightRepository } from '../infra/repositories/FlightRepository'
import { DepartureArrivalInterface } from 'app/modules/flight/domain/interfaces/DepartureArrivalInterface'
import { findMinimunCostBetweenNodes } from '../../core/helpers/findMinimunCostBetweenNodes'
import { ErrorMessages } from '../../core/utils/ErrorMessages'
import { FindBestRouteResponse } from '../input/responses/FindBestRouteResponse'
import { logger } from '../../core/helpers/logger'

export class FindBestRouteUseCase {
  constructor (
    private readonly flightRepository: FlightRepository
  ) {}

  execute (itinerary: string, cli: boolean): FindBestRouteResponse {
    const depArrival = this.setDepartureArrival(itinerary, cli) as FindBestRouteResponse
    if (depArrival.error) return depArrival

    const { from, to } = depArrival as DepartureArrivalInterface
    const airports = this.flightRepository.listAirports()

    const start = this.findFirstFlights(from)
    const connections = this.findConnectionFlights(airports, from)

    const graph = { ...start, ...connections }
    const bestRoute = findMinimunCostBetweenNodes(graph, from, to)

    if (bestRoute.distance === Infinity) this.handleError(cli, 404, ErrorMessages.flight.routeNotFound)
    return { data: bestRoute }
  }

  private setDepartureArrival (
    itinerary: string = '',
    cli: boolean
  ): DepartureArrivalInterface | FindBestRouteResponse {
    const depArrival = itinerary.split('-')

    if (depArrival.length === 1) {
      const error = cli
        ? ErrorMessages.flight.wrongCliItineraryPattern
        : ErrorMessages.flight.wrongRestItineraryPattern

        return this.handleError(cli, 400, error)
    }

    return { from: depArrival[0], to: depArrival[1] }
  }

  private findFirstFlights (from: string) {
    const fromDeparture = this.flightRepository.findFlightsDepartingFrom(from)
    let firstFlights = {}
    fromDeparture.map(item => {
      firstFlights[item.destination] = item.cost
    })

    let start = {}
    start[from] = firstFlights

    return start
  }

  private findConnectionFlights (airports: string[], from: string) {
    const otherAirports = airports.filter(airport => airport !== from)

    const secondFlights = otherAirports.map(item => {
      return this.flightRepository.findFlightsDepartingFrom(item)
    })
    const mergedSecondFlights = [].concat.apply([], secondFlights)

    let connections = {}
    otherAirports.map(departure => {
      const filterFrom = mergedSecondFlights.filter(flight => flight.departure === departure)
      let groupFrom = {}
      filterFrom.map(item => {
        return groupFrom[item.destination] = item.cost
      })

      connections[departure] = groupFrom
    })

    return connections
  }

  private handleError (cli: boolean, statusCode: number, error: string): FindBestRouteResponse {
    logger(error)
    if (cli) throw error

    return { statusCode: statusCode, error }
  }
}
