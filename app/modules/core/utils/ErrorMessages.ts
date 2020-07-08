export const ErrorMessages = {
  cli: {
    missingArg: 'Please, inform the CSV file name to start.'
  },
  file: {
    notFound: 'ERROR: ROUTES FILE MUST BE PLACED INSIDE PROJECT\'S ROOT DIRECTORY.'
  },
  flight: {
    invalidInputAddRoute: 'The request body must contain from, to and cost properties.',
    routeNotFound: 'Unable to locate best route. Please, try again...',
    wrongCliItineraryPattern: 'Itinerary must be filled following the pattern: FROM-TO',
    wrongRestItineraryPattern: 'Request must contain "from" and "to" as query string.',
  }
}
