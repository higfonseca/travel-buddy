import { ParseFlightsUseCase } from 'app/usecases/ParseFlightsUseCase'
import { SetDepartureArrivalUseCase } from 'app/usecases/SetDepartureArrivalUseCase'
import { ListAirportsUseCase } from 'app/usecases/ListAirportsUseCase'
import { FindFlightsDepartingFromAirportUseCase } from 'app/usecases/FindFlightsDepartingFromAirportUseCase'
import { dijkstra, DijkstraResponse } from 'app/helpers/dijkstra'
import { FlightInterface } from 'app/domain/interfaces/FlightInterface'

export class FindBestRouteUseCase {
  constructor (
    private readonly parseFlightsUseCase: ParseFlightsUseCase,
    private readonly setDepartureArrivalUseCase: SetDepartureArrivalUseCase,
    private readonly listAirportsUseCase: ListAirportsUseCase,
    private readonly findFlightsDepartingFromAirportUseCase: FindFlightsDepartingFromAirportUseCase,
  ) {}

  execute = (flightsFile: string[], itinerary: string): DijkstraResponse => {
    const flights = this.parseFlightsUseCase.execute(flightsFile)

    const { from, to } = this.setDepartureArrivalUseCase.execute(itinerary)
    const airports = this.listAirportsUseCase.execute(flights)

    const start = this.findFirstFlights(from, flights)
    const connections = this.findConnectionFlights(airports, from, flights)

    const graph = { ...start, ...connections }
    const bestRoute = dijkstra(graph, from, to)

    if (bestRoute.distance === Infinity) throw 'unable to locate best route. Please, try again...'
    return bestRoute
  }

  private findFirstFlights (from: string, flights: FlightInterface[]) {
    const fromDeparture = this.findFlightsDepartingFromAirportUseCase.execute(from, flights)
    const firstFlights = {}
    fromDeparture.map(item => {
      firstFlights[item.destination] = item.cost
    })

    const start = {}
    start[from] = firstFlights

    return start
  }

  private findConnectionFlights (airports: string[], from: string, flights: FlightInterface[]) {
    const otherAirports = airports.filter(airport => airport !== from)

    const secondFlights = otherAirports.map(item => {
      return this.findFlightsDepartingFromAirportUseCase.execute(item, flights)
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
