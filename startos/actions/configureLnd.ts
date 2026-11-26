import { lndCredentials, writeCredentialFiles } from '../fileModels/lndCredentials'
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
      'Hex encoding of LND’s invoice.macaroon. Payment, admin and read-only macaroons are rejected.',
    required: true,
    default: null,
    masked: true,
  }),
  tlsCert: Value.textarea({
    name: 'LND TLS Certificate',
    description: 'Paste the full PEM text of tls.cert from the same LND node.',
    required: true,
    default: null,
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
      'Use only the invoice credential from the node at this address.',
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const saved = await lndCredentials.read().once()
    const old = await storeJson.read().once()
    return {
      lndGrpcHost: saved?.grpcHost || old?.lndGrpcHost || defaultLndGrpcHost,
      lndRestHost: saved?.restHost || old?.lndRestHost || defaultLndRestHost,
      lndPrivateChannels: saved?.privateChannels ?? old?.lndPrivateChannels ?? false,
    }
  },

  async ({ effects, input }) => {
    const invoiceHex = input.lndInvoiceMacaroon.trim()
    if (!/^(?:[0-9a-f]{2})+$/i.test(invoiceHex) || invoiceHex.length > 32768) {
      throw new Error('Enter the hex encoding of invoice.macaroon.')
    }
    const credentials = {
      invoiceHex,
      tlsCert: input.tlsCert.trim() + '\n',
      grpcHost: input.lndGrpcHost,
      restHost: input.lndRestHost || defaultLndRestHost,
      privateChannels: input.lndPrivateChannels,
    }
    await sdk.SubContainer.withTemp(effects, { imageId: 'lightning-server' }, null, 'validate-lnd', async container => {
      await writeCredentialFiles(container, credentials)
      const result = await container.exec(['node', '/app/managed-lnd.cjs', 'validate'])
      if (result.exitCode !== 0) {
        throw new Error('Use the invoice-only macaroon and a PEM TLS certificate from your LND node.')
      }
    })
    await lndCredentials.write(effects, credentials)
  },
)
