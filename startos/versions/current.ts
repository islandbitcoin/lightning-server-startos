import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:1',
  releaseNotes: {
    en_US: 'Initial StartOS package for Lightning Server. Self-hosted LNURL-pay server with Nostr zap receipts and payment notifications.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
