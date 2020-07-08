import http from 'http'
import { responseToJson } from '../../helpers/responseToJson'

export class CoreController {
  healthCheck (_req: http.IncomingMessage, res: http.ServerResponse) {
    const output = { running: true }
    responseToJson(res, output)
  }
}
