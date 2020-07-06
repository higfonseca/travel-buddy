import { Request, Response } from 'express'
import {
  ParseFlightsUseCase,
  SetDepartureArrivalUseCase,
  ListAirportsUseCase,
  FindFlightsDepartingFromAirportUseCase,
  FindBestRouteUseCase
} from '../../usecases'

export class FlightController {
  private parseFlightsUseCase = new ParseFlightsUseCase()
  private setDepartureArrivalUseCase = new SetDepartureArrivalUseCase()
  private listAirportsUseCase = new ListAirportsUseCase()
  private findFlightsDepartingFromAirportUseCase = new FindFlightsDepartingFromAirportUseCase()
  private findBestRouteUseCase = new FindBestRouteUseCase(
    this.parseFlightsUseCase,
    this.setDepartureArrivalUseCase,
    this.listAirportsUseCase,
    this.findFlightsDepartingFromAirportUseCase
  )

  bestRoute (req: Request, res: Response): Response {
    const query = req.query
    const flightsFile = query.file as string
    const itinerary = query.itinerary as string

    const output = this.findBestRouteUseCase.execute(flightsFile, itinerary)
    return res.json(output)
  }
}
