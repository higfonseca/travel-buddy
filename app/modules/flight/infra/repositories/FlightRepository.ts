import { readFile, writeFile } from '../../../core/helpers/handleFile'
import { Flight } from "../entities/Flight"
import { removeUndefined } from "../../../core/helpers/removeUndefined"

export class FlightRepository {
  private flightsFile: string
  private flights: Flight[]

  constructor (flightsFile: string) {
    this.flightsFile = flightsFile

    const fileLines = readFile(flightsFile)
    this.flights = this.listFlights(fileLines)
  }

  listFlights (fileLines: string[]): Flight[] {
    const flights: (Flight | undefined)[] = fileLines.map(line => {
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
    let airports: string[] = []
    this.flights.map(flight => {
      airports.push(flight.departure)
      airports.push(flight.destination)
    })

    const airportsWithoutUndefined = removeUndefined<string[]>(airports)
    return [...new Set(airportsWithoutUndefined)]
  }

  findFlightsDepartingFrom (airport: string): Flight[] {
    return this.flights.filter(flight => flight.departure === airport)
  }

  save (data: string): void {
    writeFile(this.flightsFile, data)
  }
}
