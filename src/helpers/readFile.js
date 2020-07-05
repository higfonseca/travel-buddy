const fs = require('fs')
const removeUndefined = require('./removeUndefined.js')

exports.execute = (filePath) => {
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

  return removeUndefined.execute(flights)
}
