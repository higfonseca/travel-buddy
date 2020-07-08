import http from 'http'
import url from 'url'
import querystring from 'querystring'
import { FindBestRouteUseCase, AddRouteUseCase } from '../../usecases'
import { FlightRepository } from '../../infra/repositories/FlightRepository'
import { AddRouteRequest } from '../requests/AddRouteRequest'
import { responseToJson } from '../../../core/helpers/responseToJson'

export class FlightController {
  private findBestRouteUseCase: FindBestRouteUseCase
  private addRouteUseCase: AddRouteUseCase

  private inject (fileName: string) {
    const flightRepository = new FlightRepository(fileName)
    this.findBestRouteUseCase = new FindBestRouteUseCase(flightRepository)
    this.addRouteUseCase = new AddRouteUseCase(flightRepository)
  }

  bestRoute (req: http.IncomingMessage, res: http.ServerResponse) {
    this.inject('input-file.csv')

    const parsed = url.parse(req.url as string)
    const query  = querystring.parse(parsed.query as string)

    const from = query.from as string
    const to = query.to as string
    const itinerary = `${from}-${to}`

    const output = this.findBestRouteUseCase.execute(itinerary, false)
    responseToJson(res, output)
  }

  addRoute (req: http.IncomingMessage, res: http.ServerResponse) {
    let body: AddRouteRequest
    req.on('data', chunk => {
        body = JSON.parse(chunk.toString())
    })
    req.on('end', () => {
      this.inject('input-file.csv')

      const output = this.addRouteUseCase.execute(body)
      responseToJson(res, output)
    })
  }
}
