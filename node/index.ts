import { Service } from '@vtex/api'
import { validateSerial } from './middlewares/validateSerial'

export default new Service({
  routes: {
    validateSerial,
  },
})
