import express from 'express'
import cors from 'cors'
import { Routes } from './Routes'

export class Server {
  public express: express.Application

  constructor () {
    this.express = express()

    this.middlewares()
    this.routes()
  }

  private middlewares (): void {
    this.express.use(express.json())
    this.express.use(cors())
  }

  private routes (): void {
    const routes = new Routes()
    this.express.use(routes.execute)
  }
}
