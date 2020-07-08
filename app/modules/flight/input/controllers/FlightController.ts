import http from 'http'
import url from 'url'
import querystring from 'querystring'
import {
  SetDepartureArrivalUseCase,
  FindBestRouteUseCase
} from '../../usecases'
import { FlightRepository } from '../../infra/repositories/FlightRepository'

export class FlightController {
  private findBestRouteUseCase: FindBestRouteUseCase

  private inject (filePath: string) {
    const flightRepository = new FlightRepository(filePath)
    const setDepartureArrivalUseCase = new SetDepartureArrivalUseCase()
    this.findBestRouteUseCase = new FindBestRouteUseCase(flightRepository, setDepartureArrivalUseCase)
  }

  bestRoute (req: http.IncomingMessage, res: http.ServerResponse) {
    const parsed = url.parse(req.url as string);
    const query  = querystring.parse(parsed.query as string);

    const flightsFile = query.file as string
    const itinerary = query.itinerary as string

    this.inject(flightsFile)

    const output = this.findBestRouteUseCase.execute(itinerary)
    res.statusCode = 200
    res.setHeader('content-Type', 'Application/json')
    res.end(JSON.stringify(output))
  }
}
