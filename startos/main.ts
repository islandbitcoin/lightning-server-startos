import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import {
  appUrl,
  defaultLndGrpcHost,
  defaultLndInvoiceMacaroonFile,
  defaultLndRestHost,
  defaultLndTlsCertFile,
  httpPort,
  lndDependencyId,
  lndMountpoint,
  log,
  mountVolume,
  serviceName,
  subcontainerName,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  const store = (await storeJson.read((s) => s).const(effects)) ?? {
    domain: '',
    catchAll: true,
    users: '',
    forwards: '{}',
    lndGrpcHost: '',
    lndRestHost: '',
    lndInvoiceMacaroon: '',
    lndPrivateChannels: false,
    emailSender: '',
    emailPassword: '',
    emailRecipient: '',
    emailBcc: '',
    pushoverToken: '',
    pushoverUser: '',
    nostrPublicKey: '',
    nostrPrivateKey: '',
    mongoEnabled: false,
    mongoUser: '',
    mongoPass: '',
    mongoUrl: '',
    meta: '',
  }
  const env: Record<string, string> = {
    NODE_ENV: 'production',
    PORT: String(httpPort),
  }

  const addEnv = (name: string, value: string | boolean) => {
    const normalized = String(value)
    if (normalized.length > 0) {
      env[name] = normalized
    }
  }

  addEnv('DOMAIN', store.domain)
  addEnv('GRPC_HOST', store.lndGrpcHost || defaultLndGrpcHost)
  addEnv('REST_HOST', store.lndRestHost || defaultLndRestHost)
  addEnv('INVOICE_MACAROON', store.lndInvoiceMacaroon)
  if (!store.lndInvoiceMacaroon) {
    addEnv('INVOICE_MACAROON_FILE', defaultLndInvoiceMacaroonFile)
  }
  addEnv('LND_TLS_CERT_FILE', defaultLndTlsCertFile)
  addEnv('PRIVATE_CHANNELS', store.lndPrivateChannels)
  addEnv('USERS', store.users)
  addEnv('CATCH_ALL', store.catchAll)
  addEnv('FORWARDS', store.forwards)
  addEnv('META', store.meta)
  addEnv('EMAIL_SENDER', store.emailSender)
  addEnv('EMAIL_PASSWORD', store.emailPassword)
  addEnv('EMAIL_RECIPIENT', store.emailRecipient)
  addEnv('EMAIL_BCC', store.emailBcc)
  addEnv('PUSHOVER_TOKEN', store.pushoverToken)
  addEnv('PUSHOVER_USER', store.pushoverUser)
  addEnv('NOSTR_PUBLIC_KEY', store.nostrPublicKey)
  addEnv('NOSTR_PRIVATE_KEY', store.nostrPrivateKey)
  addEnv('USE_MONGO', store.mongoEnabled)
  addEnv('MONGODB_USER', store.mongoUser)
  addEnv('MONGODB_PASS', store.mongoPass)
  addEnv('MONGODB_URL', store.mongoUrl)

  log('Setting up main service', {
    serviceName,
    httpPort,
    appUrl,
    mountpoint: mountVolume.mountpoint,
    configuredEnvVars: Object.keys(env).filter((name) => name !== 'NODE_ENV' && name !== 'PORT'),
  })

  const mounts = sdk.Mounts.of()
    .mountVolume(mountVolume)
    .mountDependency({
      dependencyId: lndDependencyId,
      volumeId: 'main',
      subpath: null,
      mountpoint: lndMountpoint,
      readonly: true,
    })
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
      env,
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
