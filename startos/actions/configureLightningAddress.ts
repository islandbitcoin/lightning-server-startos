import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { getHttpInterfaceUrls, hostFromUrl } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  domain: Value.dynamicSelect(async ({ effects }) => {
    const urls = await getHttpInterfaceUrls(effects)
    const hosts = urls
      .map(hostFromUrl)
      .filter(Boolean)
      .filter((host, index, arr) => arr.indexOf(host) === index)
    const current = await storeJson.read((s) => s.domain).const(effects)
    const preferred =
      current ||
      hosts.find((host) => !host.endsWith('.local') && !host.endsWith('.embassy')) ||
      hosts[0] ||
      'lightning-server.embassy'

    return {
      name: 'Domain',
      description:
        'Choose the public domain exported for this service, or the local service host if no public domain is configured.',
      values: hosts.length
        ? hosts.reduce(
            (obj, host) => ({ ...obj, [host]: host }),
            {} as Record<string, string>,
          )
        : { 'lightning-server.embassy': 'lightning-server.embassy' },
      default: preferred,
    }
  }),
  catchAll: Value.toggle({
    name: 'Catch All',
    description: 'Accept payments to any username',
    default: true,
  }),
  users: Value.text({
    name: 'Users',
    description: 'Comma-separated valid usernames (e.g., alice,bob)',
    required: false,
    default: null,
  }),
  forwards: Value.textarea({
    name: 'Forwards',
    description: 'JSON map of forwards (e.g., {"d":"me@dplus.plus"})',
    required: false,
    default: null,
  }),
  meta: Value.text({
    name: 'Meta',
    description: 'Message displayed to senders in their wallet',
    required: false,
    default: null,
  }),
})

export const configureLightningAddress = sdk.Action.withInput(
  'configure-lightning-address',

  async () => ({
    name: 'Configure Lightning Address',
    description: 'Set your domain, users, and forwarding rules',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const currentDomain = await storeJson.read((s) => s.domain).const(effects)
    const urls = await getHttpInterfaceUrls(effects)
    const hosts = urls.map(hostFromUrl).filter(Boolean)
    const preferredDomain =
      currentDomain ||
      hosts.find((host) => !host.endsWith('.local') && !host.endsWith('.embassy')) ||
      hosts[0] ||
      undefined

    return {
      domain: preferredDomain,
      catchAll:
        (await storeJson.read((s) => s.catchAll).const(effects)) ?? true,
      users: (await storeJson.read((s) => s.users).const(effects)) || undefined,
      forwards: (await storeJson.read((s) => s.forwards).const(effects)) || undefined,
      meta: (await storeJson.read((s) => s.meta).const(effects)) || undefined,
    }
  },

  async ({ effects, input }) =>
    storeJson.merge(effects, {
      domain: input.domain,
      catchAll: input.catchAll,
      users: input.users || '',
      forwards: input.forwards || '{}',
      meta: input.meta || '',
    }),
)
