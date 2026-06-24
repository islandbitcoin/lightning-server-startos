import { sdk } from '../sdk'
import { configureLightningAddress } from './configureLightningAddress'
import { configureLnd } from './configureLnd'
import { configureNotifications } from './configureNotifications'
import { configureNostr } from './configureNostr'
import { configureMongo } from './configureMongo'

export const actions = sdk.Actions.of()
  .addAction(configureLightningAddress)
  .addAction(configureLnd)
  .addAction(configureNotifications)
  .addAction(configureNostr)
  .addAction(configureMongo)
