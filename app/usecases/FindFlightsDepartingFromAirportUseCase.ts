import { FlightInterface } from "app/domain/interfaces/FlightInterface"

export class FindFlightsDepartingFromAirportUseCase {
  execute (airport: string, flights: FlightInterface[]): FlightInterface[] {
    return flights.filter(flight => flight.departure === airport)
  }
}
