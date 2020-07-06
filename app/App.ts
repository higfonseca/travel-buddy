import { Server } from "./Server"

class App {
  execute () {
    const server = new Server().express

    server.listen(3000)
  }
}

new App()
