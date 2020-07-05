const fs = require('fs')

exports.execute = (filePath) => {
  const fileData = fs.readFileSync(filePath, 'utf8')
  return fileData.split('\n')
}
