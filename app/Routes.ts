import { Router } from 'express'
import { FlightController, CoreController } from './modules/flight/input/controllers'

export class Routes {
  execute () {
    const coreController = new CoreController()
    const flightController = new FlightController()

    const routes = Router()
    routes.get('/healthcheck', coreController.healthCheck)
    routes.get('/routes/best', flightController.bestRoute)
  }
}
