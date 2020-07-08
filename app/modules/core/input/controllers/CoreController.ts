import http from 'http'

export class CoreController {
  healthCheck (_req: http.IncomingMessage, res: http.ServerResponse) {
    const output = { running: true }

    res.statusCode = 200
    res.setHeader('content-Type', 'Application/json')
    res.end(JSON.stringify(output))
  }
}
