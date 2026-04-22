import { Service } from '@vtex/api'

import { validateSerial } from './middlewares/validateSerial'
import { saveActivation } from './middlewares/saveActivation'

export default new Service({
  routes: {
    validateSerial,
    saveActivation,
  },
})
