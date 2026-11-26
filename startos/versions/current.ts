import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.2.2:2',
  releaseNotes: {
    en_US:
      'After upgrading, use Configure LND Node to enter the invoice macaroon and TLS certificate. Lightning Server no longer mounts LND storage. Existing address and notification settings carry over.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
