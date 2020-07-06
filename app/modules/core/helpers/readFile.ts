import fs from 'fs'

export const readFile = (filePath: string) => {
  const fileData = fs.readFileSync(filePath, 'utf8')
  return fileData.split('\n')
}
