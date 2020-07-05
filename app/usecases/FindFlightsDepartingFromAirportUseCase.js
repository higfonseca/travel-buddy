exports.execute = (airport, flights) => {
  return flights.filter(flight => flight.departure === airport)
}
