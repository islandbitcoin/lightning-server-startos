import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.2.1:1',
  releaseNotes: {
    en_US:
      'Fixes StartOS public web UI routing by refreshing the UI interface export, plus settings persistence and compact settings UX.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
