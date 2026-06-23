import { StartSdk } from '@start9labs/start-sdk'
import { manifest } from './manifest'

export const sdk = StartSdk.of().withManifest(manifest).build(true)

export const packageLogPrefix = 'lightning-server-startos'
export const serviceName = 'lightning-server'
export const subcontainerName = 'lightning-server'
export const webInterfaceId = 'web-ui'
export const webMultiHostId = 'web'
export const httpPort = 3000
export const appUrl = 'https://lightning-server.embassy'

export const mountVolume = {
  volumeId: 'main' as const,
  subpath: null as string | null,
  mountpoint: '/data',
  readonly: false,
  type: 'directory' as const,
}

export function log(message: string, details?: unknown) {
  const prefix = `[${packageLogPrefix} ${new Date().toISOString()}]`
  if (details === undefined) {
    console.log(`${prefix} ${message}`)
  } else {
    console.log(`${prefix} ${message}`, details)
  }
}
