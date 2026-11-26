import { configureLnd } from '../actions/configureLnd'
import { lndCredentials } from '../fileModels/lndCredentials'
import { sdk } from '../sdk'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { restoreInit } from '../backups'
import { setLightningDomain } from './setLightningDomain'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  setDependencies,
  setLightningDomain,
  sdk.setupOnInit(async effects => {
    if (!(await lndCredentials.read().const(effects))) {
      await sdk.action.createOwnTask(effects, configureLnd, 'critical', {
        reason: 'Enter the invoice macaroon and TLS certificate before receiving payments.',
      })
    }
  }),
)

export const uninit = sdk.setupUninit(versionGraph)
