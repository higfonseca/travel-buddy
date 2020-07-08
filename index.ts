import readline from 'readline'
import { FlightRepository } from './app/modules/flight/infra/repositories/FlightRepository'
import { FindBestRouteUseCase } from './app/modules/flight/usecases/FindBestRouteUseCase'
import { ErrorMessages } from './app/modules/core/utils/ErrorMessages'
import { MinimumCostResponse } from './app/modules/core/helpers/findMinimunCostBetweenNodes'

const args = process.argv.slice(2)
const cli = readline.createInterface({ input: process.stdin, output: process.stdout })

if (!args.length) throw ErrorMessages.cli.missingArg

cli.question('please enter the route: ', (itinerary: string) => {
  const flightRepository = new FlightRepository(args[0])
  const output = new FindBestRouteUseCase(flightRepository).execute(itinerary, true)

  const { path, distance } = output.data as MinimumCostResponse
  cli.write(`best route: ${path.join(' - ')} > ${distance} \n`)
  cli.close()
})
