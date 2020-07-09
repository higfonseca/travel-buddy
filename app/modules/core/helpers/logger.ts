import { NODE_ENV } from '../../../Environment'

/**
 * Adding logging through a helper so it can be easly replaced by a
 * better loggin lib (Winston, for example)
 */

export const logger = (message: string) => {
  if (NODE_ENV.toLowerCase() !== 'test') console.log(message)
}
