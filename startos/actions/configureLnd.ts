import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  lndGrpcHost: Value.text({
    name: 'LND gRPC Host',
    description: 'gRPC endpoint (e.g., lnd.example.com:10009)',
    required: true,
    default: null,
  }),
  lndRestHost: Value.text({
    name: 'LND REST Host',
    description: 'REST endpoint (e.g., lnd.example.com:8080)',
    required: false,
    default: null,
  }),
  lndInvoiceMacaroon: Value.text({
    name: 'Invoice Macaroon',
    description: 'Hex-encoded invoice macaroon',
    required: true,
    default: null,
    masked: true,
  }),
  lndPrivateChannels: Value.toggle({
    name: 'Private Channels',
    description: 'Enable if using private channels',
    default: false,
  }),
})

export const configureLnd = sdk.Action.withInput(
  'configure-lnd',

  async () => ({
    name: 'Configure LND Node',
    description: 'Connect your Lightning Network Daemon node',
    warning: 'Your macaroon is stored encrypted on the StartOS volume.',
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => ({
    lndGrpcHost:
      (await storeJson.read((s) => s.lndGrpcHost).const(effects)) || undefined,
    lndRestHost:
      (await storeJson.read((s) => s.lndRestHost).const(effects)) || undefined,
    lndInvoiceMacaroon:
      (await storeJson.read((s) => s.lndInvoiceMacaroon).const(effects)) ||
      undefined,
    lndPrivateChannels:
      (await storeJson.read((s) => s.lndPrivateChannels).const(effects)) ??
      false,
  }),

  async ({ effects, input }) =>
    storeJson.merge(effects, {
      lndGrpcHost: input.lndGrpcHost,
      lndRestHost: input.lndRestHost || '',
      lndInvoiceMacaroon: input.lndInvoiceMacaroon,
      lndPrivateChannels: input.lndPrivateChannels,
    }),
)
