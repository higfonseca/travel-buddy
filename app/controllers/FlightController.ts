import { Request, Response } from 'express'

export class FlightController {
  public async index (_req: Request, res: Response): Promise<Response> {
    return res.json({
      message: 'Hello world :)'
    })
  }
}
