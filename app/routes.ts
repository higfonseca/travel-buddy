import { Router } from 'express'
import { FlightController } from 'app/controllers/FlightController'

const flightController = new FlightController()

const routes = Router()
routes.get('/', flightController.index)

export { routes }
