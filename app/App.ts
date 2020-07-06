import { Server } from "./Server"
import { PORT } from "app/Environment"

class App {
  execute () {
    const server = new Server().express

    server.listen(PORT)
  }
}

new App()
