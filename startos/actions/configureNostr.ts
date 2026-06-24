import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  nostrPublicKey: Value.text({
    name: 'Nostr Public Key',
    description: 'Hex public key',
    required: false,
    default: null,
    masked: true,
  }),
  nostrPrivateKey: Value.text({
    name: 'Nostr Private Key',
    description: 'Hex private key',
    required: false,
    default: null,
    masked: true,
  }),
})

export const configureNostr = sdk.Action.withInput(
  'configure-nostr',

  async () => ({
    name: 'Configure Nostr Keys',
    description: 'Custom Nostr keys for signing zap receipts',
    warning:
      'These keys sign zap receipts on your behalf. Use dedicated keys, not your primary identity.',
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => ({
    nostrPublicKey:
      (await storeJson.read((s) => s.nostrPublicKey).const(effects)) ||
      undefined,
    nostrPrivateKey:
      (await storeJson.read((s) => s.nostrPrivateKey).const(effects)) ||
      undefined,
  }),

  async ({ effects, input }) =>
    storeJson.merge(effects, {
      nostrPublicKey: input.nostrPublicKey || '',
      nostrPrivateKey: input.nostrPrivateKey || '',
    }),
)
