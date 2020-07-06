import { Request, Response } from 'express'

export class CoreController {
  healthCheck (_req: Request, res: Response): Response {
    return res.json({ running: true })
  }
}
