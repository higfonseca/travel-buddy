import http from 'http'
import { CoreController } from './modules/core/input/controllers/CoreController'
import { FlightController } from './modules/flight/input/controllers/FlightController'
import { logger } from './modules/core/helpers/logger'

export class Server {
  /**
   * Since there was a request to avoid using frameworks and it's a very simple application, I chose a more straight forward approach for routing.
   * */

  start () {
    return http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
      const { url, method } = req

      const coreController = new CoreController()
      const flightController = new FlightController()

      if (url === '/healthcheck' && method === 'GET') {
        const output = coreController.healthCheck(req, res)
        return output
      }

      if (url === '/routes/best' && method === 'POST') {
        const output = flightController.bestRoute(req, res)
        return output
      }

      // invalid URL/method
      logger('INVALID URL - Request type: ' + req.method + ' Endpoint: ' + req.url)
      res.statusCode = 404
      res.end()
      return
    })
  }
}
