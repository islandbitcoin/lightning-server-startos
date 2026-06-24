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
  const urls: string[] = []

  try {
    const interfaces = await sdk.serviceInterface
      .getAllOwn(effects, (interfaces) => interfaces)
      .once()

    for (const serviceInterface of interfaces) {
      const addressInfo = serviceInterface.addressInfo
      if (!addressInfo) continue

      urls.push(
        ...addressInfo.public
          .filter({ kind: 'domain' })
          .format('urlstring'),
        ...addressInfo
          .filter({ kind: 'domain' })
          .format('urlstring'),
        ...addressInfo.nonLocal.format('urlstring'),
      )
    }
  } catch (err) {
    log('Interface URL lookup skipped', err)
  }

  try {
    if (typeof effects?.getOutboundGateway === 'function') {
      const gateway = await sdk.getOutboundGateway(effects).once()
      if (gateway) urls.push(gateway)
    }
  } catch (err) {
    log('Outbound gateway lookup skipped', err)
  }

  return urls.filter((url, index, arr) => url && arr.indexOf(url) === index)
}

export const hostFromUrl = (url: string): string => {
  try {
    return new URL(url).hostname
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  }
}
