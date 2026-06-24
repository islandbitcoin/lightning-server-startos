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
)

export const uninit = sdk.setupUninit(versionGraph)
