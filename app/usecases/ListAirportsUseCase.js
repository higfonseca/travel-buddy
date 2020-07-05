const removeUndefined = require('../helpers/removeUndefined')

exports.execute = (flights) => {
  const airportsFrom = flights.map(flight => flight.departure)
  const airportsTo = flights.map(flight => flight.destination)
  const airportsAll = [...airportsFrom, ...airportsTo]

  const airportsWithoutUndefined = removeUndefined.execute(airportsAll)
  return [...new Set(airportsWithoutUndefined)]
}
