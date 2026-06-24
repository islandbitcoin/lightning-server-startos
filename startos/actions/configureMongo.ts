import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  mongoEnabled: Value.toggle({
    name: 'Enable MongoDB',
    default: false,
  }),
  mongoUser: Value.text({
    name: 'MongoDB User',
    required: false,
    default: null,
  }),
  mongoPass: Value.text({
    name: 'MongoDB Password',
    required: false,
    default: null,
    masked: true,
  }),
  mongoUrl: Value.text({
    name: 'MongoDB URL',
    description: 'MongoDB connection URL',
    required: false,
    default: null,
  }),
})

export const configureMongo = sdk.Action.withInput(
  'configure-mongo',

  async () => ({
    name: 'Configure MongoDB Aliases',
    description: 'Enable dynamic Lightning Address aliases via MongoDB',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => ({
    mongoEnabled:
      (await storeJson.read((s) => s.mongoEnabled).const(effects)) ?? false,
    mongoUser:
      (await storeJson.read((s) => s.mongoUser).const(effects)) || undefined,
    mongoPass:
      (await storeJson.read((s) => s.mongoPass).const(effects)) || undefined,
    mongoUrl:
      (await storeJson.read((s) => s.mongoUrl).const(effects)) || undefined,
  }),

  async ({ effects, input }) =>
    storeJson.merge(effects, {
      mongoEnabled: input.mongoEnabled,
      mongoUser: input.mongoUser || '',
      mongoPass: input.mongoPass || '',
      mongoUrl: input.mongoUrl || '',
    }),
)
