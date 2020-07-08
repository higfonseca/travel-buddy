import http from 'http'
import url from 'url'
import { CoreController } from './modules/core/input/controllers/CoreController'
import { FlightController } from './modules/flight/input/controllers/FlightController'
import { logger } from './modules/core/helpers/logger'
import { responseToJson } from './modules/core/helpers/responseToJson'

export class Server {
  /**
   * Since there was a request to avoid using frameworks and it's a very simple application, I chose this more straight forward approach for routing.
   * */

  start () {
    return http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
      const { method } = req
      const parsedUrl = url.parse(req.url as string)

      const coreController = new CoreController()
      const flightController = new FlightController()

      if (parsedUrl.pathname === '/healthcheck' && method === 'GET') {
        const output = coreController.healthCheck(req, res)
        return output
      }

      if (parsedUrl.pathname === '/routes/best' && method === 'GET') {
        const output = flightController.bestRoute(req, res)
        return output
      }

      if (parsedUrl.pathname === '/routes/add' && method === 'POST') {
        const output = flightController.addRoute(req, res)
        return output
      }

      // invalid URL/method
      const error = 'INVALID URL - Request type: ' + req.method + ' Endpoint: ' + req.url
      logger(error)
      responseToJson(res, { statusCode: 404, error })
      return
    })
  }
}
