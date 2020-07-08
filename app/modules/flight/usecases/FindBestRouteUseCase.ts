import { FlightRepository } from '../infra/repositories/FlightRepository'
import { SetDepartureArrivalUseCase } from 'app/modules/flight/usecases'
import { findMinimunCostBetweenNodes, DijkstraResponse } from '../../core/helpers/findMinimunCostBetweenNodes'

export class FindBestRouteUseCase {
  constructor (
    private readonly flightRepository: FlightRepository,
    private readonly setDepartureArrivalUseCase: SetDepartureArrivalUseCase
  ) {}

  execute (itinerary: string): DijkstraResponse {
    const { from, to } = this.setDepartureArrivalUseCase.execute(itinerary)
    const airports = this.flightRepository.listAirports()

    const start = this.findFirstFlights(from)
    const connections = this.findConnectionFlights(airports, from)

    const graph = { ...start, ...connections }
    const bestRoute = findMinimunCostBetweenNodes(graph, from, to)

    if (bestRoute.distance === Infinity) throw 'unable to locate best route. Please, try again...'
    return bestRoute
  }

  private findFirstFlights (from: string) {
    const fromDeparture = this.flightRepository.findFlightsDepartingFrom(from)
    const firstFlights = {}
    fromDeparture.map(item => {
      firstFlights[item.destination] = item.cost
    })

    const start = {}
    start[from] = firstFlights

    return start
  }

  private findConnectionFlights (airports: string[], from: string) {
    const otherAirports = airports.filter(airport => airport !== from)

    const secondFlights = otherAirports.map(item => {
      return this.flightRepository.findFlightsDepartingFrom(item)
    })
    const mergedSecondFlights = [].concat.apply([], secondFlights)

    const connections = {}
    otherAirports.map(departure => {
      const filterFrom = mergedSecondFlights.filter(flight => flight.departure === departure)
      const groupFrom = {}
      filterFrom.map(item => {
        return groupFrom[item.destination] = item.cost
      })

      connections[departure] = groupFrom
    })

    return connections
  }
}
