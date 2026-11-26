import { FileHelper, z } from '@start9labs/start-sdk'
import { mkdir, writeFile } from 'fs/promises'
import { sdk } from '../sdk'

export const credentialDirectory = '/run/lightning-server-lnd'
const schema = z.object({
  invoiceHex: z.string(),
  tlsCert: z.string(),
  grpcHost: z.string(),
  restHost: z.string(),
  privateChannels: z.boolean(),
})
export const lndCredentials = FileHelper.json(
  { base: sdk.volumes.credentials, subpath: './lnd.json' },
  schema,
)

export async function writeCredentialFiles(
  container: { rootfs: string },
  credentials: { invoiceHex: string; tlsCert: string },
) {
  const dir = container.rootfs + credentialDirectory
  await mkdir(dir, { recursive: true, mode: 0o700 })
  await writeFile(dir + '/invoice.macaroon', Buffer.from(credentials.invoiceHex, 'hex'), { mode: 0o600 })
  await writeFile(dir + '/tls.cert', credentials.tlsCert, { mode: 0o600 })
}
