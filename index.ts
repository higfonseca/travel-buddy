import clear from 'clear'
import readline from 'readline'
import { FlightRepository } from './app/modules/flight/infra/repositories/FlightRepository'
import { FindBestRouteUseCase, SetDepartureArrivalUseCase } from './app/modules/flight/usecases'

clear()
const args = process.argv.slice(2)
const cli = readline.createInterface({ input: process.stdin, output: process.stdout })

if (!args.length) throw 'please, inform the CSV file name to start.'

cli.question('please enter the route: ', (itinerary: string) => {
  const flightRepository = new FlightRepository(args[0])
  const setDepartureArrivalUseCase = new SetDepartureArrivalUseCase()
  const output = new FindBestRouteUseCase(
    flightRepository,
    setDepartureArrivalUseCase
  ).execute(itinerary)

  const { path, distance } = output
  cli.write(`best route: ${path.join(' - ')} > ${distance} \n`)
  cli.close()
})
