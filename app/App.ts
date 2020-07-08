import { HOSTNAME, PORT } from "./Environment"
import { Server } from "./Server"
import { logger } from "./modules/core/helpers/logger"

class App {
	start () {
		const server = new Server().start()
		server.listen(PORT, HOSTNAME, undefined, () => {
			logger(`Server running on port ${PORT}`)
			logger('Press Ctrl+C to stop')
		})
	}
}

new App().start()
