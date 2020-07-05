const dijkstra = require('../helpers/dijkstra')
const FindFlightsDepartingFromAirportUseCase = require('./FindFlightsDepartingFromAirportUseCase')
const ListAirportsUseCase = require('./ListAirportsUseCase')
const ParseFlightsUseCase = require('./ParseFlightsUseCase')
const SetDepartureArrivalUseCase = require('./SetDepartureArrivalUseCase')

exports.execute = (cli, flightsFile) => {
  const flights = ParseFlightsUseCase.execute(flightsFile)

  cli.question('please enter the route: ', (itinerary) => {
    const { from, to } = SetDepartureArrivalUseCase.execute(itinerary)
    const airports = ListAirportsUseCase.execute(flights)

    const fromDeparture = FindFlightsDepartingFromAirportUseCase.execute(from, flights)
    const firstFlights = {}
    fromDeparture.map(item => {
      firstFlights[item.destination] = item.cost
    })

    const start = {}
    start[from] = firstFlights

    const otherAirports = airports.filter(airport => airport !== from)

    const secondFlights = otherAirports.map(item => FindFlightsDepartingFromAirportUseCase.execute(item, flights))
    const mergedSecondFlights = [].concat.apply([], secondFlights)

    const connections = {}
    otherAirports.map(departure => {
      const filterFrom = mergedSecondFlights.filter(flight => flight.departure === departure)
      const groupFrom = {}
      filterFrom.map(item => {
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
