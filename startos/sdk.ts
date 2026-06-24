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
export const lndDependencyId = 'lnd'
export const lndMountpoint = '/mnt/lnd'
export const defaultLndGrpcHost = 'lnd.embassy:10009'
export const defaultLndRestHost = 'lnd.embassy:8080'
export const defaultLndInvoiceMacaroonFile =
  `${lndMountpoint}/data/chain/bitcoin/mainnet/invoice.macaroon`
export const defaultLndTlsCertFile = `${lndMountpoint}/tls.cert`

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

export const getHttpInterfaceUrls = async (
  effects: any,
): Promise<string[]> => {
  const result = await effects.systemQuery(
    'try { interfaces } catch { null }',
  )
  if (!result) return []

  const systemUrls: string[] = []

  for (const inf of result) {
    const url = inf['url'] as string | undefined
    if (url) systemUrls.push(url)
  }

  return systemUrls
}

export const hostFromUrl = (url: string): string => {
  try {
    return new URL(url).hostname
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  }
}
