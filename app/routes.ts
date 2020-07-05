import { Router } from 'express'
import { FlightController } from 'app/controllers'

const flightController = new FlightController()

const routes = Router()
routes.get('/', flightController.index)

export { routes }
