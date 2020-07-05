const removeUndefined = require('../helpers/removeUndefined')

exports.execute = (fileLines) => {
  const flights = fileLines.map(line => {
    const item = line.split(',')
    return {
      departure: item[0],
      destination: item[1],
      cost: parseInt(item[2])
    }
  })

  return removeUndefined.execute(flights)
}
