const args = process.argv.slice(2)
const readline = require('readline')

const readFile = require('./src/helpers/readFile.js')
const removeUndefined = require('./src/helpers/removeUndefined.js')
const dijkstra = require('./src/helpers/dijkstra.js')

const cli = readline.createInterface({ input: process.stdin, output: process.stdout })

function listAirports (flights) {
  const airportsFrom = flights.map(flight => flight.departure)
  const airportsTo = flights.map(flight => flight.destination)
  const airportsAll = [...airportsFrom, ...airportsTo]

  const airportsWithoutUndefined = removeUndefined.execute(airportsAll)
  return [...new Set(airportsWithoutUndefined)]
}

function departsFrom (airport, flights) {
  return flights.filter(flight => flight.departure === airport)
}

function setDepartureArrival (itinerary) {
  const depArrival = itinerary.split('-')
  if (depArrival.length === 1) throw 'itinerary must be filled following the pattern: FROM-TO'

  return { from: depArrival[0], to: depArrival[1] }
}

function main () {
  if (!args.length) throw 'please, inform the routes csv file path as first argument.'
  const flights = readFile.execute(args[0])

  cli.question('please enter the route: ', (itinerary) => {
    const { from, to } = setDepartureArrival(itinerary)
    const airports = listAirports(flights)

    const checkDirectFlight = flights.find(flight => flight.departure === from && flight.destination === to)

    const fromDeparture = departsFrom(from, flights)
    const firstFlights = {}
    fromDeparture.map(item => {
      firstFlights[item.destination] = item.cost
    })

    const start = {}
    start[from] = firstFlights

    const otherAirports = airports.filter(airport => airport !== from)
    const secondFlights = otherAirports.map(item => departsFrom(item, flights))
    const mergedSecondFlights = [].concat.apply([], secondFlights)

    const connections = {}
    otherAirports.map(departure => {
      const filterFrom = mergedSecondFlights.filter(flight => flight.departure === departure)
      const groupFrom = {}
      filterFrom.map(item => {
        // const destination = item.destination === to ? 'finish' : item.destination
        return groupFrom[item.destination] = item.cost
      })

      connections[departure] = groupFrom
    })

    const graph = { ...start, ...connections }
    const bestRoute = dijkstra.execute(graph, from, to)

    const { path, distance } = bestRoute
    if (distance === Infinity) throw 'unable to locate best route. Please, try again...'

    cli.write(`best route: ${path.join(' - ')} > ${distance} \n`)
    cli.close()
  });
}

main()
