exports.execute = (itinerary) => {
  const depArrival = itinerary.split('-')
  if (depArrival.length === 1) throw 'itinerary must be filled following the pattern: FROM-TO'

  return { from: depArrival[0], to: depArrival[1] }
}
