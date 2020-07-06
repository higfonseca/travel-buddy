import { FlightInterface } from "../domain/interfaces/FlightInterface"
import { removeUndefined } from "../helpers/removeUndefined"


export class ListAirportsUseCase {
  execute (flights: FlightInterface[]): string[] {
    const airportsFrom = flights.map(flight => flight.departure)
    const airportsTo = flights.map(flight => flight.destination)
    const airportsAll = [...airportsFrom, ...airportsTo]

    const airportsWithoutUndefined = removeUndefined<string[]>(airportsAll)
    return [...new Set(airportsWithoutUndefined)]
  }
}
