import fs, { existsSync } from 'fs'
import { ErrorMessages } from '../utils/ErrorMessages'

function fileExists (filePath: string) {
  const fileExists = existsSync(filePath)
  if (!fileExists) throw ErrorMessages.file.notFound
}

export const readFile = (filePath: string) => {
  fileExists(filePath)

  const fileData = fs.readFileSync(filePath, 'utf8')
  return fileData.split('\n')
}

export const writeFile = (filePath: string, data: string) => {
  fileExists(filePath)
  fs.appendFileSync(filePath, `\n${data}`)
}
