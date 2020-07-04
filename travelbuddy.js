const args = process.argv.slice(2)
const readline = require('readline')
const fs = require('fs')

const cli = readline.createInterface({ input: process.stdin, output: process.stdout })

function error (message) {
  cli.write(message + '\n')
  cli.close()
}

function readFile (filePath) {
  const fileData = fs.readFileSync(filePath, 'utf8')
  const lines = fileData.split('\n')

  return lines.map(line => {
    const item = line.split(',')
    return {
      departure: item[0],
      destination: item[1],
      cost: item[2]
    }
  })
}

function listAirports (flights) {
  const airportsFrom = flights.map(flight => flight.departure)
  const airportsTo = flights.map(flight => flight.destination)
  const airports = [...airportsFrom, ...airportsTo]
  return [...new Set(airports)]
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
    const otherFlights = otherAirports.map(other => {
      const nodes = departsFrom(other, flights)

      const others = {}
      const bbb = {}
      const aaa = nodes.map(item => {
        bbb[item.destination] = item.cost
        return bbb
      })
      others[other] = aaa
      return others
    })


    // console.log({start, finish: {}})
    // console.log({otherAirports})
    console.log(otherFlights[0])

    // console.log(`best route: ${answer}`)

    cli.close()
  });
}


main()
