import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { defaultLndGrpcHost, defaultLndRestHost } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  lndGrpcHost: Value.text({
    name: 'LND gRPC Host',
    description:
      'gRPC endpoint. Leave the default to use the self-hosted LND dependency.',
    required: true,
    default: defaultLndGrpcHost,
  }),
  lndRestHost: Value.text({
    name: 'LND REST Host',
    description:
      'REST endpoint. Leave the default to use the self-hosted LND dependency.',
    required: false,
    default: defaultLndRestHost,
  }),
  lndInvoiceMacaroon: Value.text({
    name: 'Invoice Macaroon',
    description:
      'Optional override. By default this package reads invoice.macaroon from the self-hosted LND dependency.',
    required: false,
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
    description:
      'Connect your Lightning Network Daemon node. The self-hosted LND dependency is used by default.',
    warning:
      'Only paste a macaroon here if you are overriding the self-hosted LND dependency.',
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => ({
    lndGrpcHost:
      (await storeJson.read((s) => s.lndGrpcHost).const(effects)) ||
      defaultLndGrpcHost,
    lndRestHost:
      (await storeJson.read((s) => s.lndRestHost).const(effects)) ||
      defaultLndRestHost,
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
      lndInvoiceMacaroon: input.lndInvoiceMacaroon || '',
      lndPrivateChannels: input.lndPrivateChannels,
    }),
)
