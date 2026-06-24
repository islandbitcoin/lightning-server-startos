import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z
  .object({
    domain: z.string().default(''),
    catchAll: z.boolean().default(true),
    users: z.string().default(''),
    forwards: z.string().default('{}'),
    lndGrpcHost: z.string().default(''),
    lndRestHost: z.string().default(''),
    lndInvoiceMacaroon: z.string().default(''),
    lndPrivateChannels: z.boolean().default(false),
    emailSender: z.string().default(''),
    emailPassword: z.string().default(''),
    emailRecipient: z.string().default(''),
    emailBcc: z.string().default(''),
    pushoverToken: z.string().default(''),
    pushoverUser: z.string().default(''),
    nostrPublicKey: z.string().default(''),
    nostrPrivateKey: z.string().default(''),
    mongoEnabled: z.boolean().default(false),
    mongoUser: z.string().default(''),
    mongoPass: z.string().default(''),
    mongoUrl: z.string().default(''),
    meta: z.string().default(''),
  })
  .strip()

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
