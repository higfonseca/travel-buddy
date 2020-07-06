import { FlightInterface } from '../domain/interfaces/FlightInterface'
import { removeUndefined } from '../../core/helpers/removeUndefined'

export class ParseFlightsUseCase {
  execute (fileLines: string[]): FlightInterface[] {
    const flights: (FlightInterface | undefined)[] = fileLines.map(line => {
      const item = line.split(',')
      return {
        departure: item[0],
        destination: item[1],
        cost: parseInt(item[2])
      }
    })

    return removeUndefined<FlightInterface[]>(flights)
  }
}
