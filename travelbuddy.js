const readline = require('readline')
const readFile = require('./app/helpers/readFile')
const FindBestRouteUseCase = require('./app/usecases/FindBestRouteUseCase')

const args = process.argv.slice(2)
const cli = readline.createInterface({ input: process.stdin, output: process.stdout })

if (!args.length) throw 'please, inform the CSV file path to start.'

const flightsFile = readFile.execute(args[0])
FindBestRouteUseCase.execute(cli, flightsFile)
