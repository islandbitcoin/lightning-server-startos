import { sdk } from './sdk'
import { appUrl, httpPort, log, mountVolume, serviceName, subcontainerName } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  log('Setting up main service', {
    serviceName,
    httpPort,
    appUrl,
    mountpoint: mountVolume.mountpoint,
  })

  const mounts = sdk.Mounts.of().mountVolume(mountVolume)
  log('Mount configuration created', mountVolume)

  const subcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: serviceName },
    mounts,
    subcontainerName,
  )
  log('Subcontainer created', {
    imageId: serviceName,
    subcontainerName,
    rootfs: subcontainer.rootfs,
  })

  let healthCheckAttempt = 0

  const daemons = sdk.Daemons.of(effects).addDaemon(serviceName, {
    subcontainer,
    exec: {
      command: sdk.useEntrypoint(),
      env: {
        NODE_ENV: 'production',
        PORT: String(httpPort),
      },
    },
    ready: {
      display: 'Web Interface',
      fn: async () => {
        healthCheckAttempt += 1
        log('Running readiness check', {
          attempt: healthCheckAttempt,
          url: `http://127.0.0.1:${httpPort}/api/health`,
        })

        const result = await sdk.healthCheck.checkWebUrl(
          effects,
          `http://127.0.0.1:${httpPort}/api/health`,
          {
            timeout: 60_000,
            successMessage: 'Lightning Server is ready',
            errorMessage: 'Lightning Server is still starting. If this persists, please check the logs.',
          },
        )
        log('Health check result', {
          attempt: healthCheckAttempt,
          result,
        })
        return result
      },
    },
    requires: [],
  })

  log('Main service setup complete', { daemon: serviceName })
  return daemons
})
