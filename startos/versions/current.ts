import { FileHelper, VersionInfo, IMPOSSIBLE, z } from '@start9labs/start-sdk'

import { sdk } from '../sdk'

// Both the old package action and the web UI could save an LND credential.
// Remove only that field, retaining any settings introduced outside the SDK.
async function clearLegacyMacaroons(effects: Parameters<typeof sdk.action.createOwnTask>[0]) {
  for (const name of ['store.json', 'config.json']) {
    const file = FileHelper.json(
      { base: sdk.volumes.main, subpath: name },
      z.record(z.string(), z.unknown()),
    )
    const settings = await file.read().once()
    if (settings && 'lndInvoiceMacaroon' in settings) {
      const { lndInvoiceMacaroon, ...preserved } = settings
      await file.write(effects, preserved)
    }
  }
}

export const current = VersionInfo.of({
  version: '0.2.2:2',
  releaseNotes: {
    en_US:
      'After upgrading, use Configure LND Node to enter the invoice macaroon and TLS certificate. Lightning Server no longer mounts LND storage. Existing address and notification settings carry over.',
  },
  migrations: {
    up: ({ effects }) => clearLegacyMacaroons(effects),
    down: IMPOSSIBLE,
  },
})
