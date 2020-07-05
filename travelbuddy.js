const args = process.argv.slice(2)
const readline = require('readline')
const fs = require('fs')
const dijkstra = require('./src/dijkstra.js')

const cli = readline.createInterface({ input: process.stdin, output: process.stdout })

function error (message) {
  cli.write(message + '\n')
  cli.close()
}

function removeUndefined (array) {
  return array.filter(item => item !== undefined && item !== '')
}

function readFile (filePath) {
  const fileData = fs.readFileSync(filePath, 'utf8')
  const lines = fileData.split('\n')

  const flights = lines.map(line => {
    const item = line.split(',')
    return {
      departure: item[0],
      destination: item[1],
      cost: parseInt(item[2])
    }
  })

  return removeUndefined(flights)
}

function listAirports (flights) {
  const airportsFrom = flights.map(flight => flight.departure)
  const airportsTo = flights.map(flight => flight.destination)
  const airportsAll = [...airportsFrom, ...airportsTo]

  const airportsWithoutUndefined = removeUndefined(airportsAll)
  return [...new Set(airportsWithoutUndefined)]
}

function departsFrom (airport, flights) {
  return flights.filter(flight => flight.departure === airport)
}



function main () {
  if (!args.length) {
    error('ERROR: please, inform the routes csv file path as first argument.')
    return
  }

  const flights = readFile(args[0])


  cli.question('please enter the route: ', (itinerary) => {
    const departureArrival = itinerary.split('-')
    if (departureArrival.length === 1) {
      error('ERROR: itinerary must be filled following the pattern: FROM-TO')
      return
    }

    const airports = listAirports(flights)
    const from = departureArrival[0]
    const to = departureArrival[1]

    const fromDeparture = departsFrom(from, flights)
    const start = {}
    fromDeparture.map(item => {
      start[item.destination] = item.cost
    })

    const otherAirports = airports.filter(airport => airport !== from)
    const secondFlights = otherAirports.map(item => departsFrom(item, flights))
    const mergedSecondFlights = [].concat.apply([], secondFlights)

    const connections = {}
    otherAirports.map(departure => {
      const filterFrom = mergedSecondFlights.filter(flight => flight.departure === departure)
      const groupFrom = {}
      filterFrom.map(item => {
        const destination = item.destination === to ? 'finish' : item.destination
        return groupFrom[destination] = item.cost
      })

      connections[departure] = groupFrom
    })

    delete connections[to]
    const graph = { start, ...connections, finish: {} }
    const bestRoute = dijkstra.dijkstra(graph)

    const { path, distance } = bestRoute
    delete path['start']
    delete path['finish']

    console.log(`best route: ${path} > ${distance}`)

    cli.close()
  });
}


main()
