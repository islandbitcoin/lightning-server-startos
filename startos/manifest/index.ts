import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'lightning-server',
  title: 'Lightning Server',
  license: 'Apache-2.0',
  packageRepo: 'https://github.com/islandbitcoin/lightning-server-startos',
  upstreamRepo: 'https://github.com/dplusplus1024/lightning-server',
  marketingUrl: 'https://github.com/dplusplus1024/lightning-server',
  donationUrl: null,
  description: {
    short: {
      en_US: 'Self-hosted Lightning Address server with Nostr zap receipts and payment notifications.',
    },
    long: {
      en_US:
        'Lightning Server enables you to receive Lightning Address payments at you@yourdomain.com. ' +
        'It generates BOLT11 invoices via your LND node, publishes Nostr zap receipts (NIP-57), ' +
        'and sends email and push notifications for every payment received. ' +
        'Supports multi-user Lightning Addresses, alias forwarding, MongoDB-backed dynamic aliases, ' +
        'phoenixd webhooks, and Nostr profile resolution.',
    },
  },
  volumes: ['main'],
  images: {
    'lightning-server': {
      source: { dockerTag: 'ghcr.io/forge0x/lightning-server:0.1.0' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    lnd: {
      description:
        'Lightning Server uses your self-hosted LND node to generate BOLT11 invoices and monitor received payments.',
      optional: false,
      metadata: {
        title: 'LND',
        icon: 'https://raw.githubusercontent.com/Start9Labs/lnd-startos/master/icon.svg',
      },
    },
  },
})
