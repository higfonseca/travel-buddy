import { readFile } from '../../../core/helpers/handleFile'
import { Flight } from "../entities/Flight"
import { removeUndefined } from "../../../core/helpers/removeUndefined"

export class FlightRepository {
  private fileLines: string[]
  private flights: Flight[]

  constructor (flightsFilePath: string) {
    this.fileLines = readFile(flightsFilePath)
    this.flights = this.listFlights()
  }

  listFlights (): Flight[] {
    const flights: (Flight | undefined)[] = this.fileLines.map(line => {
      const item = line.split(',')
      return {
        departure: item[0],
        destination: item[1],
        cost: parseInt(item[2])
      }
    })

    return removeUndefined<Flight[]>(flights)
  }

  listAirports (): string[] {
    const airportsFrom = this.flights.map(flight => flight.departure)
    const airportsTo = this.flights.map(flight => flight.destination)
    const airportsAll = [...airportsFrom, ...airportsTo]

    const airportsWithoutUndefined = removeUndefined<string[]>(airportsAll)
    return [...new Set(airportsWithoutUndefined)]
  }

  findFlightsDepartingFrom (airport: string): Flight[] {
    return this.flights.filter(flight => flight.departure === airport)
  }
}
