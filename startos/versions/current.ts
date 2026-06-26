import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.2.2:1',
  releaseNotes: {
    en_US:
      'Fixes invoice generation against the mounted StartOS LND dependency, public web UI routing, settings persistence, and compact settings UX.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
