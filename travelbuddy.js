const createInterface = 'readline'
const readFile = './app/helpers/readFile.ts'
import { FindBestRouteUseCase } from './app/usecases/FindBestRouteUseCase.ts'

const args = process.argv.slice(2)
const cli = createInterface({ input: process.stdin, output: process.stdout })

if (!args.length) throw 'please, inform the CSV file path to start.'

cli.question('please enter the route: ', (itinerary) => {
  const flightsFile = readFile(args[0])
  const output = new FindBestRouteUseCase().execute(flightsFile, itinerary)

  const { path, distance } = output
  cli.write(`best route: ${path.join(' - ')} > ${distance} \n`)
  cli.close()
})
