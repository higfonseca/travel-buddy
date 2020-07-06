import { Router } from 'express'
import { FlightController } from './input/controllers/FlightController'
import { CoreController } from 'app/input/controllers/CoreController'

export class Routes {
  execute () {
    const coreController = new CoreController()
    const flightController = new FlightController()

    const routes = Router()
    routes.get('/healthcheck', coreController.healthCheck)
    routes.get('/routes/best', flightController.bestRoute)
  }
}
