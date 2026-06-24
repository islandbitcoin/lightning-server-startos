import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  emailSender: Value.text({
    name: 'Email Sender',
    description: 'Gmail address for sending notifications',
    required: false,
    default: null,
  }),
  emailPassword: Value.text({
    name: 'Email Password',
    description: 'Gmail app password',
    required: false,
    default: null,
    masked: true,
  }),
  emailRecipient: Value.text({
    name: 'Email Recipient',
    description: 'Where to send notifications',
    required: false,
    default: null,
  }),
  emailBcc: Value.text({
    name: 'Email BCC',
    description: 'BCC address',
    required: false,
    default: null,
  }),
  pushoverToken: Value.text({
    name: 'Pushover Token',
    description: 'Pushover API token',
    required: false,
    default: null,
    masked: true,
  }),
  pushoverUser: Value.text({
    name: 'Pushover User',
    description: 'Pushover user key',
    required: false,
    default: null,
    masked: true,
  }),
})

export const configureNotifications = sdk.Action.withInput(
  'configure-notifications',

  async () => ({
    name: 'Configure Notifications',
    description: 'Email and push notification settings for received payments',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => ({
    emailSender:
      (await storeJson.read((s) => s.emailSender).const(effects)) || undefined,
    emailPassword:
      (await storeJson.read((s) => s.emailPassword).const(effects)) || undefined,
    emailRecipient:
      (await storeJson.read((s) => s.emailRecipient).const(effects)) ||
      undefined,
    emailBcc: (await storeJson.read((s) => s.emailBcc).const(effects)) || undefined,
    pushoverToken:
      (await storeJson.read((s) => s.pushoverToken).const(effects)) || undefined,
    pushoverUser:
      (await storeJson.read((s) => s.pushoverUser).const(effects)) || undefined,
  }),

  async ({ effects, input }) =>
    storeJson.merge(effects, {
      emailSender: input.emailSender || '',
      emailPassword: input.emailPassword || '',
      emailRecipient: input.emailRecipient || '',
      emailBcc: input.emailBcc || '',
      pushoverToken: input.pushoverToken || '',
      pushoverUser: input.pushoverUser || '',
    }),
)
